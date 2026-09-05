import { prisma } from "@/lib/prisma";

import { mapWorkerBooking } from "./bookingMapper";

export async function getWorkerBookings(userId: string) {
  const worker = await prisma.worker.findUnique({
    where: {
      userId,
    },
  });

  if (!worker) {
    throw new Error("Worker profile not found.");
  }

  const bookings = await prisma.booking.findMany({
    where: {
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

    orderBy: {
      scheduledDate: "asc",
    },
  });

  return bookings.map(mapWorkerBooking);
}
