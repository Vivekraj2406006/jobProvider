import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { getWorkerDashboard } from "@/services/worker/dashboard";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (user.role !== "WORKER") {
      return NextResponse.json(
        {
          success: false,
          message: "Only workers can access this dashboard.",
        },
        {
          status: 403,
        },
      );
    }

    const dashboard = await getWorkerDashboard(user.userId);

    return NextResponse.json(
      {
        success: true,
        dashboard,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Worker Dashboard Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load worker dashboard.",
      },
      {
        status: 500,
      },
    );
  }
}
