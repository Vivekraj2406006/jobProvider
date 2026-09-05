import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { getWorkerBookingDetails } from "@/services/worker/bookingDetails";
import {
  BookingAction,
  updateBookingStatus,
} from "@/services/worker/bookingWorkflow";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: Params,
) {
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

    const { id } = await params;

    const booking = await getWorkerBookingDetails(
      user.userId,
      id,
    );

    return NextResponse.json(
      {
        success: true,
        booking,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Worker booking details error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load booking.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: Params,
) {
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

    const { id } = await params;
    const body = await request.json();

    const action = body.action as BookingAction;

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          message: "Action is required.",
        },
        {
          status: 400,
        },
      );
    }

    const booking = await updateBookingStatus(
      user.userId,
      id,
      action,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Booking updated successfully.",
        booking,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Worker booking action error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update booking.",
      },
      {
        status: 400,
      },
    );
  }
}
