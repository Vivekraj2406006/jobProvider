import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    // Authentication check
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Worker role check
    if (user.role !== "WORKER") {
      return NextResponse.json(
        {
          success: false,
          message: "Only workers can update their location",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { latitude, longitude } = body;

    // Basic type validation
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid coordinates",
        },
        { status: 400 }
      );
    }

    // Geographic range validation
    if (latitude < -90 || latitude > 90) {
      return NextResponse.json(
        {
          success: false,
          message: "Latitude must be between -90 and 90",
        },
        { status: 400 }
      );
    }

    if (longitude < -180 || longitude > 180) {
      return NextResponse.json(
        {
          success: false,
          message: "Longitude must be between -180 and 180",
        },
        { status: 400 }
      );
    }

    // Make sure the worker profile exists
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

    const updatedWorker = await prisma.worker.update({
      where: {
        id: worker.id,
      },
      data: {
        latitude,
        longitude,
      },
      select: {
        id: true,
        latitude: true,
        longitude: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Location updated successfully",
      worker: updatedWorker,
    });
  } catch (error) {
    console.error("Update worker location error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
