import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET(request: NextRequest) {
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

    if (user.role !== "WORKER") {
      return NextResponse.json(
        {
          success: false,
          message: "Only workers can access availability",
        },
        { status: 403 }
      );
    }

    const worker = await prisma.worker.findUnique({
      where: {
        userId: user.userId,
      },
      select: {
        id: true,
      },
    });

    if (!worker) {
      return NextResponse.json(
        {
          success: false,
          message: "Worker profile not found",
        },
        { status: 404 }
      );
    }

    const availability = await prisma.workerAvailability.findMany({
      where: {
        workerId: worker.id,
      },
      orderBy: {
        dayOfWeek: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      availability,
    });
  } catch (error) {
    console.error("Get worker availability error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

/**
 * Replace the worker's complete weekly schedule.
 *
 * Frontend sends the entire weekly schedule.
 * Backend replaces the existing schedule.
 */
export async function PUT(request: NextRequest) {
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

    if (user.role !== "WORKER") {
      return NextResponse.json(
        {
          success: false,
          message: "Only workers can update availability",
        },
        { status: 403 }
      );
    }

    const worker = await prisma.worker.findUnique({
      where: {
        userId: user.userId,
      },
      select: {
        id: true,
      },
    });

    if (!worker) {
      return NextResponse.json(
        {
          success: false,
          message: "Worker profile not found",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (!Array.isArray(body.availability)) {
      return NextResponse.json(
        {
          success: false,
          message: "Availability must be an array",
        },
        { status: 400 }
      );
    }

    const days = new Set<number>();

    for (const item of body.availability) {
      if (
        typeof item.dayOfWeek !== "number" ||
        !Number.isInteger(item.dayOfWeek) ||
        item.dayOfWeek < 0 ||
        item.dayOfWeek > 6
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid day of week",
          },
          { status: 400 }
        );
      }

      if (days.has(item.dayOfWeek)) {
        return NextResponse.json(
          {
            success: false,
            message: `Duplicate availability for day ${item.dayOfWeek}`,
          },
          { status: 400 }
        );
      }

      days.add(item.dayOfWeek);

      if (
        typeof item.startTime !== "string" ||
        typeof item.endTime !== "string"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid availability time",
          },
          { status: 400 }
        );
      }

      if (
        !/^\d{2}:\d{2}$/.test(item.startTime) ||
        !/^\d{2}:\d{2}$/.test(item.endTime)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Time must use HH:mm format",
          },
          { status: 400 }
        );
      }

      const [startHour, startMinute] = item.startTime
        .split(":")
        .map(Number);

      const [endHour, endMinute] = item.endTime
        .split(":")
        .map(Number);

      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;

      if (
        startHour > 23 ||
        endHour > 23 ||
        startMinute > 59 ||
        endMinute > 59 ||
        startMinutes >= endMinutes
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid availability time range",
          },
          { status: 400 }
        );
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.workerAvailability.deleteMany({
        where: {
          workerId: worker.id,
        },
      });

      if (body.availability.length > 0) {
        await tx.workerAvailability.createMany({
          data: body.availability.map(
            (item: {
              dayOfWeek: number;
              startTime: string;
              endTime: string;
              isActive?: boolean;
            }) => ({
              workerId: worker.id,
              dayOfWeek: item.dayOfWeek,
              startTime: item.startTime,
              endTime: item.endTime,
              isActive: item.isActive ?? true,
            })
          ),
        });
      }
    });

    const availability = await prisma.workerAvailability.findMany({
      where: {
        workerId: worker.id,
      },
      orderBy: {
        dayOfWeek: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Availability updated successfully",
      availability,
    });
  } catch (error) {
    console.error("Update worker availability error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

/**
 * Toggle worker online/offline status.
 *
 * PATCH body:
 * {
 *   "isAvailable": true
 * }
 */
export async function PATCH(request: NextRequest) {
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

    if (user.role !== "WORKER") {
      return NextResponse.json(
        {
          success: false,
          message: "Only workers can change availability status",
        },
        { status: 403 }
      );
    }

    const worker = await prisma.worker.findUnique({
      where: {
        userId: user.userId,
      },
      select: {
        id: true,
        isAvailable: true,
      },
    });

    if (!worker) {
      return NextResponse.json(
        {
          success: false,
          message: "Worker profile not found",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (typeof body.isAvailable !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "isAvailable must be a boolean",
        },
        { status: 400 }
      );
    }

    const updatedWorker = await prisma.worker.update({
      where: {
        id: worker.id,
      },
      data: {
        isAvailable: body.isAvailable,
      },
      select: {
        id: true,
        isAvailable: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: updatedWorker.isAvailable
        ? "Worker is now online"
        : "Worker is now offline",
      isAvailable: updatedWorker.isAvailable,
    });
  } catch (error) {
    console.error("Toggle worker availability error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
