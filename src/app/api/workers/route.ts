import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const token = authHeader.split(" ")[1];

    const payload = (await verifyToken(token)) as {
      userId: string;
      role: string;
    };

    if (!payload?.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const {
      skills,
      experience,
      bio,
      availability,
      state,
      city,
      area,
      pincode,
    } = await request.json();

    if (
      !skills ||
      skills.length === 0 ||
      !state ||
      !city ||
      !area ||
      !pincode
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all required fields",
        },
        {
          status: 400,
        },
      );
    }

    if (experience < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Experience cannot be negative",
        },
        {
          status: 400,
        },
      );
    }

    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid pincode",
        },
        {
          status: 400,
        },
      );
    }

    const existingWorker = await prisma.worker.findUnique({
      where: {
        userId: payload.userId,
      },
    });

    if (existingWorker) {
      return NextResponse.json(
        {
          success: false,
          message: "Worker profile already exists",
        },
        {
          status: 409,
        },
      );
    }

    const worker = await prisma.worker.create({
      data: {
        userId: payload.userId,

        skill: skills,

        experience,

        bio,

        isAvailable: availability,

        state,
        city,
        area,
        pincode,
      },
    });

    await prisma.user.update({
      where: {
        id: payload.userId,
      },
      data: {
        role: "WORKER",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Worker profile created successfully",
        worker,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Worker Create Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
