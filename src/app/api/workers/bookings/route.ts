import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { getWorkerBookings } from "@/services/worker/bookings";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (user.role !== "WORKER") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Worker account required.",
        },
        {
          status: 403,
        },
      );
    }

    const bookings = await getWorkerBookings(user.userId);

    return NextResponse.json(
      {
        success: true,
        bookings,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Worker bookings error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load worker bookings.",
      },
      {
        status: 500,
      },
    );
  }
}
