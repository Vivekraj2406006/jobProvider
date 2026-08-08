import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const authHeader = await request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }
    const token = authHeader.split(" ")[1];
    const decoded = await verifyToken(token);
    const userId = decoded.userId as string;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User id is required",
        },
        { status: 400 },
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
      latitude,
      longitude,
    } = await request.json();

    if (!skills || skills.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one skill is required",
        },
        { status: 400 },
      );
    }

    const existingWorker = await prisma.worker.findUnique({
      where: {
        userId,
      },
    });

    if (existingWorker) {
      return NextResponse.json(
        {
          success: false,
          message: "Worker profile already exists",
        },
        { status: 409 },
      );
    }

    const worker = await prisma.$transaction(async (tx) => {
      const createdWorker = await tx.worker.create({
        data: {
          userId,
          skill: skills,
          experience,
          bio,
          isAvailable: availability,
          state,
          city,
          area,
          pincode,
          latitude,
          longitude,
        },
      });

      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          role: "WORKER",
        },
      });

      return createdWorker;
    });

    const newToken = await generateToken(userId, "WORKER");

    return NextResponse.json(
      {
        success: true,
        message: "Worker profile created successfully",
        token: newToken,
        worker,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
