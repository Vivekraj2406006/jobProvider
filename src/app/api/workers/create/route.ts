import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);

    if (!decoded?.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid authentication token",
        },
        { status: 401 }
      );
    }

    const userId = decoded.userId as string;

    const body = await request.json();

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
    } = body;

    // -----------------------------
    // Validate skills
    // -----------------------------

    if (
      !Array.isArray(skills) ||
      skills.length === 0 ||
      skills.some(
        (skill) =>
          typeof skill !== "string" ||
          skill.trim().length === 0
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one valid skill is required",
        },
        { status: 400 }
      );
    }

    const cleanedSkills = skills
      .map((skill: string) => skill.trim())
      .filter(Boolean);

    // -----------------------------
    // Validate online/offline state
    // -----------------------------

    if (typeof availability !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "Availability must be a boolean",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Validate coordinates
    // -----------------------------

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid latitude and longitude are required",
        },
        { status: 400 }
      );
    }

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

    // -----------------------------
    // Check existing worker
    // -----------------------------

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
        { status: 409 }
      );
    }

    // -----------------------------
    // Create worker
    // -----------------------------

    const worker = await prisma.$transaction(
      async (tx) => {
        const createdWorker = await tx.worker.create({
          data: {
            userId,
            skill: cleanedSkills,
            experience:
              typeof experience === "number"
                ? experience
                : 0,
            bio:
              typeof bio === "string"
                ? bio.trim()
                : null,
            isAvailable: availability,
            state:
              typeof state === "string"
                ? state.trim()
                : null,
            city:
              typeof city === "string"
                ? city.trim()
                : null,
            area:
              typeof area === "string"
                ? area.trim()
                : null,
            pincode:
              typeof pincode === "string"
                ? pincode.trim()
                : null,
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
      }
    );

    const newToken = await generateToken(
      userId,
      "WORKER"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Worker profile created successfully",
        token: newToken,
        worker,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Worker creation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
