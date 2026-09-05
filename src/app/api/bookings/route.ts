import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { assignWorkerToBooking } from "@/services/booking/matching";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    if (user.role !== "CUSTOMER") {
      return NextResponse.json(
        {
          success: false,
          message: "Only customers can create bookings",
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    const { serviceId, packageId, addressId, scheduledDate, startTime, notes } =
      body;

    if (
      !serviceId ||
      !packageId ||
      !addressId ||
      !scheduledDate ||
      !startTime
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required booking information",
        },
        { status: 400 },
      );
    }

    // Verify package belongs to selected service
    const servicePackage = await prisma.servicePackage.findFirst({
      where: {
        id: packageId,
        serviceId,
        isActive: true,
      },
    });

    if (!servicePackage) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid service package",
        },
        { status: 400 },
      );
    }

    // Make sure address belongs to logged-in customer
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.userId,
      },
    });

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid address",
        },
        { status: 400 },
      );
    }

    // Verify service exists and is active
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        isActive: true,
      },
    });

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found",
        },
        { status: 404 },
      );
    }

    // Convert date/time
    const start = new Date(startTime);

    if (Number.isNaN(start.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid start time",
        },
        { status: 400 },
      );
    }

    const end = new Date(
      start.getTime() + servicePackage.durationMin * 60 * 1000,
    );

    const bookingDate = new Date(scheduledDate);

    if (Number.isNaN(bookingDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid scheduled date",
        },
        { status: 400 },
      );
    }

    // Prevent booking in the past
    if (start <= new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot book a service in the past",
        },
        { status: 400 },
      );
    }

    // Calculate pricing on the server
    const basePrice = servicePackage.price;
    const platformFee = 0;
    const discount = 0;

    const totalAmount = basePrice + platformFee - discount;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        customerId: user.userId,
        serviceId,
        packageId,
        addressId,

        scheduledDate: bookingDate,
        startTime: start,
        endTime: end,

        status: "PENDING",

        basePrice,
        platformFee,
        discount,
        totalAmount,

        notes: notes?.trim() || null,
      },

      include: {
        service: true,
        package: true,
        address: true,
      },
    });

    /*
     * Try to assign a worker.
     *
     * If matching fails, the booking should still remain valid.
     */
    let assignment = {
      assigned: false,
      workerId: null as string | null,
      distanceKm: null as number | null,
    };

    try {
      assignment = await assignWorkerToBooking(booking.id);
    } catch (assignmentError) {
      console.error("Worker assignment error:", assignmentError);
    }

    // Fetch the final booking after worker assignment
    const finalBooking = await prisma.booking.findUnique({
      where: {
        id: booking.id,
      },

      include: {
        service: true,
        package: true,
        address: true,

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
      },
    });

    return NextResponse.json(
      {
        success: true,

        message: assignment.assigned
          ? "Booking created and worker assigned"
          : "Booking created. We are finding a suitable worker.",

        booking: finalBooking,

        assignment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create booking error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    if (user.role !== "CUSTOMER") {
      return NextResponse.json(
        {
          success: false,
          message: "Only customers can view bookings",
        },
        { status: 403 },
      );
    }

    const bookings = await prisma.booking.findMany({
      where: {
        customerId: user.userId,
      },
      orderBy: {
        scheduledDate: "desc",
      },
      include: {
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
      },
    });

    return NextResponse.json(
      {
        success: true,
        bookings,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get customer bookings error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
