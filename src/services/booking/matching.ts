import { prisma } from "@/lib/prisma";

const ACTIVE_BOOKING_STATUSES = [
  "ASSIGNED",
  "ACCEPTED",
  "ON_THE_WAY",
  "ARRIVED",
  "IN_PROGRESS",
] as const;

const MAX_MATCHING_DISTANCE_KM = 25;

const BOOKING_TIME_ZONE = "Asia/Kolkata";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const earthRadiusKm = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function getDateTimeMinutes(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: BOOKING_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);

  const hour = Number(
    parts.find((part) => part.type === "hour")?.value ?? 0,
  );

  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? 0,
  );

  return hour * 60 + minute;
}

function getDayOfWeekInTimeZone(date: Date) {
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: BOOKING_TIME_ZONE,
    weekday: "short",
  }).format(date);

  const days: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return days[day];
}

export async function assignWorkerToBooking(
  bookingId: string,
  excludedWorkerIds: string[] = [],
) {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      service: {
        select: {
          id: true,
          name: true,
        },
      },
      address: {
        select: {
          latitude: true,
          longitude: true,
        },
      },
    },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  if (booking.status !== "PENDING") {
    return {
      assigned: false,
      workerId: booking.workerId,
      distanceKm: null,
      reason: "Booking is not pending.",
    };
  }

  if (
    booking.address.latitude === null ||
    booking.address.longitude === null
  ) {
    return {
      assigned: false,
      workerId: null,
      distanceKm: null,
      reason: "Booking address does not have coordinates.",
    };
  }

  const bookingDayOfWeek = getDayOfWeekInTimeZone(booking.startTime);

  const bookingStartMinutes = getDateTimeMinutes(booking.startTime);
  const bookingEndMinutes = getDateTimeMinutes(booking.endTime);

  if (bookingEndMinutes <= bookingStartMinutes) {
    return {
      assigned: false,
      workerId: null,
      distanceKm: null,
      reason: "Invalid booking time range.",
    };
  }

  /*
   * Find workers who:
   * - have not rejected this booking
   * - are online
   * - have coordinates
   * - have an active schedule for the booking day
   */
  const workers = await prisma.worker.findMany({
    where: {
      /*
       * Do not consider workers explicitly excluded by the caller.
       * This is still useful during the current matching operation.
       */
      ...(excludedWorkerIds.length > 0
        ? {
            id: {
              notIn: excludedWorkerIds,
            },
          }
        : {}),

      isAvailable: true,

      latitude: {
        not: null,
      },

      longitude: {
        not: null,
      },

      availability: {
        some: {
          dayOfWeek: bookingDayOfWeek,
          isActive: true,
        },
      },
    },

    include: {
      availability: {
        where: {
          dayOfWeek: bookingDayOfWeek,
          isActive: true,
        },
      },
    },
  });

  /*
   * Persistent rejection check.
   *
   * Even if excludedWorkerIds is empty, a worker who previously
   * rejected this booking must never be selected again.
   */
  const rejectedAttempts = await prisma.bookingWorkerAttempt.findMany({
    where: {
      bookingId: booking.id,
      status: "REJECTED",
    },
    select: {
      workerId: true,
    },
  });

  const rejectedWorkerIds = new Set(
    rejectedAttempts.map((attempt) => attempt.workerId),
  );

  const requiredSkill = normalize(booking.service.name);

  const skilledWorkers = workers.filter((worker) => {
    if (rejectedWorkerIds.has(worker.id)) {
      return false;
    }

    return worker.skill.some((skill) => {
      const normalizedSkill = normalize(skill);

      return (
        normalizedSkill === requiredSkill ||
        requiredSkill.startsWith(`${normalizedSkill} `)
      );
    });
  });

  if (skilledWorkers.length === 0) {
    return {
      assigned: false,
      workerId: null,
      distanceKm: null,
      reason: "No eligible workers found.",
    };
  }

  const eligibleWorkers: Array<{
    worker: (typeof skilledWorkers)[number];
    distanceKm: number;
  }> = [];

  for (const worker of skilledWorkers) {
    if (worker.latitude === null || worker.longitude === null) {
      continue;
    }

    /*
     * Check worker's weekly working hours.
     */
    const worksDuringBooking = worker.availability.some((schedule) => {
      const scheduleStart = timeToMinutes(schedule.startTime);
      const scheduleEnd = timeToMinutes(schedule.endTime);

      return (
        bookingStartMinutes >= scheduleStart &&
        bookingEndMinutes <= scheduleEnd
      );
    });

    if (!worksDuringBooking) {
      continue;
    }

    /*
     * Check whether the worker has a conflicting booking
     * on the same date and overlapping time.
     */
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        workerId: worker.id,

        status: {
          in: [...ACTIVE_BOOKING_STATUSES],
        },

        scheduledDate: booking.scheduledDate,

        startTime: {
          lt: booking.endTime,
        },

        endTime: {
          gt: booking.startTime,
        },
      },

      select: {
        id: true,
      },
    });

    if (conflictingBooking) {
      continue;
    }

    const distanceKm = calculateDistanceKm(
      booking.address.latitude,
      booking.address.longitude,
      worker.latitude,
      worker.longitude,
    );

    if (distanceKm > MAX_MATCHING_DISTANCE_KM) {
      continue;
    }

    eligibleWorkers.push({
      worker,
      distanceKm,
    });
  }

  if (eligibleWorkers.length === 0) {
    return {
      assigned: false,
      workerId: null,
      distanceKm: null,
      reason: "No workers available for this time and location.",
    };
  }

  /*
   * Nearest worker first.
   */
  eligibleWorkers.sort((a, b) => a.distanceKm - b.distanceKm);

  const selectedWorker = eligibleWorkers[0];

  /*
   * Create/update the worker attempt as OFFERED before assignment.
   *
   * Because bookingId + workerId is unique, the same worker will
   * have only one history row for this booking.
   */
  await prisma.bookingWorkerAttempt.upsert({
    where: {
      bookingId_workerId: {
        bookingId: booking.id,
        workerId: selectedWorker.worker.id,
      },
    },
    create: {
      bookingId: booking.id,
      workerId: selectedWorker.worker.id,
      status: "OFFERED",
    },
    update: {
      status: "OFFERED",
    },
  });

  /*
   * Atomically assign only if the booking is still pending
   * and currently has no worker.
   */
  const assignment = await prisma.$transaction(async (tx) => {
    const result = await tx.booking.updateMany({
      where: {
        id: booking.id,
        status: "PENDING",
        workerId: null,
      },
      data: {
        workerId: selectedWorker.worker.id,
        status: "ASSIGNED",
      },
    });

    /*
     * Only mark this attempt ASSIGNED when the Booking update
     * actually succeeded.
     */
    if (result.count > 0) {
      await tx.bookingWorkerAttempt.update({
        where: {
          bookingId_workerId: {
            bookingId: booking.id,
            workerId: selectedWorker.worker.id,
          },
        },
        data: {
          status: "ASSIGNED",
        },
      });
    }

    return result;
  });

  if (assignment.count === 0) {
    /*
     * Another request may have assigned/updated the booking first.
     *
     * Since this worker was not actually assigned, leave the
     * attempt available for future handling.
     */
    const latestBooking = await prisma.booking.findUnique({
      where: {
        id: booking.id,
      },
      select: {
        workerId: true,
        status: true,
      },
    });

    return {
      assigned: false,
      workerId: latestBooking?.workerId ?? null,
      distanceKm: null,
      reason: "Booking was already assigned or updated.",
    };
  }

  const updatedBooking = await prisma.booking.findUnique({
    where: {
      id: booking.id,
    },
  });

  return {
    assigned: true,
    workerId: selectedWorker.worker.id,
    distanceKm: Number(selectedWorker.distanceKm.toFixed(2)),
    booking: updatedBooking,
  };
}
