import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { getWorkerEarnings } from "@/services/worker/earnings";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (user.role !== "WORKER") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied.",
        },
        {
          status: 403,
        },
      );
    }

    const earnings = await getWorkerEarnings(user.userId);

    return NextResponse.json(
      {
        success: true,
        earnings,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
