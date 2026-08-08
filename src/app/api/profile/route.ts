import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface JwtPayload {
  userId: string;
  role: string;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
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

    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid authorization format",
        },
        {
          status: 401,
        },
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Token missing",
        },
        {
          status: 401,
        },
      );
    }


    const decoded = await verifyToken(token)
    if(!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        {
          status: 401,
        },
      );
    }

    if (!decoded?.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token payload",
        },
        {
          status: 401,
        },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,

        worker: {
          select: {
            skill: true,
            experience: true,
            bio: true,
            phone: true,
            profileImage: true,

            rating: true,
            completedJobs: true,

            isAvailable: true,

            state: true,
            city: true,
            area: true,
            pincode: true,

            latitude: true,
            longitude: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        user,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Profile Fetch Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
