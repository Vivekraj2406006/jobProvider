import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface VerifyOtpBody {
  email: string;
  otp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyOtpBody = await request.json();

    const email = body.email?.trim().toLowerCase();

    const otp = body.otp?.trim();

    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and OTP are required",
        },
        {
          status: 400,
        },
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP must be a 6-digit number",
        },
        {
          status: 400,
        },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
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

    if (!user.otp) {
      return NextResponse.json(
        {
          success: false,
          message: "No OTP found. Please request a new OTP.",
        },
        {
          status: 400,
        },
      );
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP expired",
        },
        {
          status: 400,
        },
      );
    }

    if (otp !== user.otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        {
          status: 400,
        },
      );
    }

    // Prevent OTP reuse
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        otp: null,
        otpExpiry: null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "OTP verified successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Verify OTP Error:", error);

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
