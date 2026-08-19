import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendOtpBody {
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const isDevelopment = process.env.NODE_ENV !== "production";
    const fromAddress = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    const body: SendOtpBody = await request.json();

    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
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

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    /**
     * Prevent email enumeration.
     * Always return success even if user doesn't exist.
     */
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message: "If an account exists, an OTP has been sent.",
        },
        {
          status: 200,
        },
      );
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        otp,
        otpExpiry,
      },
    });

    if (!process.env.RESEND_API_KEY) {
      if (isDevelopment) {
        console.log(`Development OTP for ${email}: ${otp}`);

        return NextResponse.json(
          {
            success: true,
            message: "OTP generated successfully in development mode.",
          },
          {
            status: 200,
          },
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Email service is not configured",
        },
        {
          status: 500,
        },
      );
    }

    try {
      const { error } = await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: "Password Reset OTP",
        html: `
            <div style="font-family: Arial, sans-serif;">
              <h2>Password Reset Request</h2>

              <p>Your OTP is:</p>

              <h1 style="letter-spacing: 5px;">
                ${otp}
              </h1>

              <p>
                This OTP will expire in
                <strong>10 minutes</strong>.
              </p>

              <p>
                If you did not request a password reset,
                please ignore this email.
              </p>
            </div>
          `,
      });

      if (error) {
        if (isDevelopment) {
          console.error("Resend Error in development mode:", error);
          console.log(`Fallback OTP for ${email}: ${otp}`);

          return NextResponse.json(
            {
              success: true,
              message: "OTP generated successfully in development mode.",
            },
            {
              status: 200,
            },
          );
        }

        console.error("Resend Error:", error);

        return NextResponse.json(
          {
            success: false,
            message: "Failed to send OTP",
          },
          {
            status: 500,
          },
        );
      }
    } catch (emailError) {
      if (isDevelopment) {
        console.error("Email delivery failed in development mode:", emailError);
        console.log(`Fallback OTP for ${email}: ${otp}`);

        return NextResponse.json(
          {
            success: true,
            message: "OTP generated successfully in development mode.",
          },
          {
            status: 200,
          },
        );
      }

      throw emailError;
    }

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Send OTP Error:", error);

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
