import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
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

    await verifyToken(token);

    return NextResponse.next();
  } catch {
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
}

export const config = {
  matcher: ["/api/test-protected/:path*", "/api/workers/:path*"],
};
