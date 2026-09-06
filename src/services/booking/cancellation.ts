import { BookingStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const CUSTOMER_CANCELLABLE_STATUSES: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.ASSIGNED,
  BookingStatus.ACCEPTED,
];

export async function cancelBookingByCustomer(
  bookingId: string,
  customerId: string
) {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      customerId,
    },
    select: {
      id: true,
      customerId: true,
      workerId: true,
      status: true,
    },
  });

  if (!booking) {
    throw new Error("BOOKING_NOT_FOUND");
  }

  if (!CUSTOMER_CANCELLABLE_STATUSES.includes(booking.status)) {
    throw new Error(
      `BOOKING_CANNOT_BE_CANCELLED:${booking.status}`
    );
  }

  const updatedBooking = await prisma.$transaction(async (tx) => {
    /*
     * The status condition is intentional.
     *
     * It protects us from a race where a worker changes the booking
     * at nearly the same time that the customer tries to cancel it.
     */
    const result = await tx.booking.updateMany({
      where: {
        id: bookingId,
        customerId,
        status: {
          in: CUSTOMER_CANCELLABLE_STATUSES,
        },
      },
      data: {
        status: BookingStatus.CANCELLED,
      },
    });

    if (result.count !== 1) {
      throw new Error("BOOKING_STATE_CHANGED");
    }

    /*
     * Keep workerId for historical visibility.
     *
     * The booking is no longer considered active because its status
     * is CANCELLED, while the customer can still see which worker
     * had previously been assigned.
     */
    return tx.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            imageUrl: true,
          },
        },
        package: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            durationMin: true,
          },
        },
        address: {
          select: {
            id: true,
            label: true,
            name: true,
            phone: true,
            addressLine: true,
            area: true,
            city: true,
            state: true,
            pincode: true,
            latitude: true,
            longitude: true,
          },
        },
        worker: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        workerAttempts: {
          orderBy: {
            createdAt: "asc",
          },
          select: {
            id: true,
            workerId: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  });

  return updatedBooking;
}
