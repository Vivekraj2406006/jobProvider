import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getCurrentUser } from "@/lib/getCurrentUser";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
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
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        booking,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get customer booking error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
