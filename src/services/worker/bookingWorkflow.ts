import { BookingStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { assignWorkerToBooking } from "@/services/booking/matching";

export type BookingAction =
  | "accept"
  | "reject"
  | "startJourney"
  | "markArrived"
  | "startWork"
  | "complete";

const BOOKING_TRANSITIONS: Record<
  BookingStatus,
  Partial<Record<BookingAction, BookingStatus>>
> = {
  PENDING: {},

  ASSIGNED: {
    accept: "ACCEPTED",
    reject: "REJECTED",
  },

  ACCEPTED: {
    startJourney: "ON_THE_WAY",
  },

  ON_THE_WAY: {
    markArrived: "ARRIVED",
  },

  ARRIVED: {
    startWork: "IN_PROGRESS",
  },

  IN_PROGRESS: {
    complete: "COMPLETED",
  },

  COMPLETED: {},
  CANCELLED: {},
  REJECTED: {},
};

function isBookingAction(value: unknown): value is BookingAction {
  return (
    value === "accept" ||
    value === "reject" ||
    value === "startJourney" ||
    value === "markArrived" ||
    value === "startWork" ||
    value === "complete"
  );
}

export async function updateBookingStatus(
  workerUserId: string,
  bookingId: string,
  action: BookingAction,
) {
  if (!isBookingAction(action)) {
    throw new Error("Invalid booking action.");
  }

  const worker = await prisma.worker.findUnique({
    where: {
      userId: workerUserId,
    },
  });

  if (!worker) {
    throw new Error("Worker not found.");
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  if (booking.workerId !== worker.id) {
    throw new Error("This booking is not assigned to you.");
  }

  const nextStatus = BOOKING_TRANSITIONS[booking.status]?.[action];

  if (!nextStatus) {
    throw new Error(
      `Cannot perform "${action}" when booking is "${booking.status}".`,
    );
  }

  /*
   * Rejection is handled separately because:
   *
   * 1. The worker attempt must be permanently marked REJECTED.
   * 2. The booking must be released.
   * 3. The booking must immediately be rematched.
   */
  if (action === "reject") {
    return rejectAndRematch(worker.id, booking.id);
  }

  const updatedBooking = await prisma.$transaction(async (tx) => {
    /*
     * Atomic state transition.
     *
     * The booking must still have:
     * - this worker assigned
     * - the original status
     */
    const result = await tx.booking.updateMany({
      where: {
        id: booking.id,
        workerId: worker.id,
        status: booking.status,
      },
      data: {
        status: nextStatus,
      },
    });

    if (result.count === 0) {
      throw new Error(
        "Booking was already updated. Please refresh and try again.",
      );
    }

    /*
     * When the worker accepts the booking, persist that
     * acceptance in BookingWorkerAttempt.
     */
    if (action === "accept") {
      const attempt = await tx.bookingWorkerAttempt.updateMany({
        where: {
          bookingId: booking.id,
          workerId: worker.id,
          status: "ASSIGNED",
        },
        data: {
          status: "ACCEPTED",
        },
      });

      /*
       * If the attempt record is missing or already has a different
       * status, do not silently pretend the acceptance was recorded.
       */
      if (attempt.count === 0) {
        throw new Error(
          "Worker assignment history could not be updated.",
        );
      }
    }

    if (nextStatus === "COMPLETED") {
      await tx.worker.update({
        where: {
          id: worker.id,
        },
        data: {
          completedJobs: {
            increment: 1,
          },
        },
      });
    }

    return tx.booking.findUnique({
      where: {
        id: booking.id,
      },
    });
  });

  if (!updatedBooking) {
    throw new Error("Booking could not be found after update.");
  }

  return updatedBooking;
}

async function rejectAndRematch(
  workerId: string,
  bookingId: string,
) {
  /*
   * First persist the rejection and release the booking atomically.
   *
   * The attempt history remains even after Booking.workerId becomes null.
   */
  const releasedBooking = await prisma.$transaction(async (tx) => {
    /*
     * Mark this worker's assignment attempt as REJECTED.
     */
    const attempt = await tx.bookingWorkerAttempt.updateMany({
      where: {
        bookingId,
        workerId,
        status: "ASSIGNED",
      },
      data: {
        status: "REJECTED",
      },
    });

    /*
     * The worker must have an ASSIGNED attempt.
     * Otherwise something is inconsistent in the booking history.
     */
    if (attempt.count === 0) {
      throw new Error(
        "Worker assignment history could not be updated for rejection.",
      );
    }

    /*
     * Release the booking.
     *
     * IMPORTANT:
     * The booking becomes PENDING, but the rejection record above
     * permanently remembers that this worker already rejected it.
     */
    const result = await tx.booking.updateMany({
      where: {
        id: bookingId,
        workerId,
        status: "ASSIGNED",
      },
      data: {
        workerId: null,
        status: "PENDING",
      },
    });

    if (result.count === 0) {
      throw new Error(
        "Booking was already updated. Please refresh and try again.",
      );
    }

    return tx.booking.findUnique({
      where: {
        id: bookingId,
      },
    });
  });

  if (!releasedBooking) {
    throw new Error(
      "Booking could not be released for rematching.",
    );
  }

  /*
   * Find another worker.
   *
   * The matcher now checks BookingWorkerAttempt directly, so the
   * rejected worker remains excluded even without relying on this
   * in-memory exclusion list.
   */
  const matchingResult = await assignWorkerToBooking(
    bookingId,
    [workerId],
  );

  /*
   * No replacement worker found.
   *
   * Leave the booking PENDING so it can be matched later.
   */
  if (!matchingResult.assigned) {
    return {
      ...releasedBooking,
      workerId: null,
      status: "PENDING" as const,
    };
  }

  return matchingResult.booking;
}
