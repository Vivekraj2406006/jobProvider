import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { cancelBookingByCustomer } from "@/services/booking/cancellation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (user.role !== "CUSTOMER") {
      return NextResponse.json(
        {
          success: false,
          message: "Only customers can view bookings",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        customerId: user.userId,
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

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        booking,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get customer booking error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (user.role !== "CUSTOMER") {
      return NextResponse.json(
        {
          success: false,
          message: "Only customers can update bookings",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    let body: { action?: string } = {};

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
        },
        { status: 400 }
      );
    }

    if (body.action !== "cancel") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking action",
        },
        { status: 400 }
      );
    }

    const booking = await cancelBookingByCustomer(
      id,
      user.userId
    );

    return NextResponse.json(
      {
        success: true,
        message: "Booking cancelled successfully",
        booking,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "BOOKING_NOT_FOUND") {
        return NextResponse.json(
          {
            success: false,
            message: "Booking not found",
          },
          { status: 404 }
        );
      }

      if (error.message === "BOOKING_STATE_CHANGED") {
        return NextResponse.json(
          {
            success: false,
            message:
              "This booking was updated before it could be cancelled. Please refresh and try again.",
          },
          { status: 409 }
        );
      }

      if (error.message.startsWith("BOOKING_CANNOT_BE_CANCELLED:")) {
        const status = error.message.split(":")[1];

        return NextResponse.json(
          {
            success: false,
            message: `Booking cannot be cancelled while it is ${status.toLowerCase().replaceAll("_", " ")}.`,
          },
          { status: 409 }
        );
      }
    }

    console.error("Cancel customer booking error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to cancel booking",
      },
      { status: 500 }
    );
  }
}
