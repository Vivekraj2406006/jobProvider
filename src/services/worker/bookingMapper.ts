import { Prisma } from "@prisma/client";

import { WorkerBookingDetails } from "@/types/workerBooking";

type WorkerBookingWithRelations = Prisma.BookingGetPayload<{
  include: {
    customer: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };

    service: {
      select: {
        id: true;
        name: true;
        category: true;
        imageUrl: true;
      };
    };

    package: {
      select: {
        id: true;
        name: true;
        description: true;
        price: true;
        durationMin: true;
      };
    };

    address: {
      select: {
        name: true;
        phone: true;
        addressLine: true;
        area: true;
        city: true;
        state: true;
        pincode: true;
        latitude: true;
        longitude: true;
      };
    };
  };
}>;

export function mapWorkerBooking(
  booking: WorkerBookingWithRelations,
): WorkerBookingDetails {
  return {
    id: booking.id,

    customer: {
      id: booking.customer.id,
      name: booking.customer.name,
      email: booking.customer.email,
    },

    service: {
      id: booking.service.id,
      name: booking.service.name,
      category: booking.service.category,
      imageUrl: booking.service.imageUrl,
    },

    package: {
      id: booking.package.id,
      name: booking.package.name,
      description: booking.package.description,
      price: booking.package.price,
      durationMin: booking.package.durationMin,
    },

    address: {
      name: booking.address.name,
      phone: booking.address.phone,
      addressLine: booking.address.addressLine,
      area: booking.address.area,
      city: booking.address.city,
      state: booking.address.state,
      pincode: booking.address.pincode,
      latitude: booking.address.latitude,
      longitude: booking.address.longitude,
    },

    scheduledDate: booking.scheduledDate,
    startTime: booking.startTime,
    endTime: booking.endTime,

    status: booking.status,

    basePrice: booking.basePrice,
    platformFee: booking.platformFee,
    discount: booking.discount,
    totalAmount: booking.totalAmount,

    notes: booking.notes,

    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}
