import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assignNearestWorker } from "@/services/assignment.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid authorization format",
        },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Token missing",
        },
        { status: 401 },
      );
    }

    const decoded = await verifyToken(token);

    if (!decoded?.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const { serviceId, description, latitude, longitude } =
      await request.json();

    if (!serviceId) {
      return NextResponse.json(
        {
          success: false,
          message: "Service is required",
        },
        { status: 400 },
      );
    }

    if (!description?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Description is required",
        },
        { status: 400 },
      );
    }

    if (
      latitude === null ||
      latitude === undefined ||
      longitude === null ||
      longitude === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Location is required",
        },
        { status: 400 },
      );
    }

    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
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

    if (!service.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Service is currently unavailable",
        },
        { status: 400 },
      );
    }

    const job = await prisma.job.create({
      data: {
        serviceId,
        customerId: user.id,
        description: description.trim(),
        budget: service.price,
        latitude,
        longitude,
      },
      include: {
        service: true,
      },
    });

    try {
      const assignedWorker = await assignNearestWorker(job.id);

      console.log("================================");
      console.log("Assigned Worker:", assignedWorker);
      console.log("================================");
    } catch (error) {
      console.error("================================");
      console.error("WORKER ASSIGNMENT FAILED");
      console.error(error);
      console.error("================================");

      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Job created successfully",
        job,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create Job Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
