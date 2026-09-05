import { prisma } from "@/lib/prisma";

import { mapWorkerBooking } from "./bookingMapper";

export async function getWorkerBookingDetails(
  workerUserId: string,
  bookingId: string,
) {
  const worker = await prisma.worker.findUnique({
    where: {
      userId: workerUserId,
    },
  });

  if (!worker) {
    throw new Error("Worker profile not found.");
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      workerId: worker.id,
    },

    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      service: {
        select: {
          id: true,
          name: true,
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
    },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  return mapWorkerBooking(booking);
}
