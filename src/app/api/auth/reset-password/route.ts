import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

interface ResetPasswordBody {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ResetPasswordBody = await request.json();

    const email = body.email?.trim().toLowerCase();

    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        {
          status: 400,
        },
      );
    }

    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address",
        },
        {
          status: 400,
        },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters",
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
          message: "Account not found",
        },
        {
          status: 404,
        },
      );
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpiry: null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Reset Password Error:", error);

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
