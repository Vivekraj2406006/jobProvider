import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, generateToken } from "@/lib/auth";

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body: LoginBody = await request.json();

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

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Prevent user enumeration
    if (!user || !user.password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        {
          status: 401,
        },
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        {
          status: 401,
        },
      );
    }

    // Optional future checks
    /*
    if (!user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please verify your account",
        },
        {
          status: 403,
        }
      );
    }

    if (user.isBlocked) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Account has been blocked",
        },
        {
          status: 403,
        }
      );
    }
    */

    const token = await generateToken(user.id, user.role);

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Login Error:", error);

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
