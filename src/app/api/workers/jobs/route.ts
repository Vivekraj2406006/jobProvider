import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { getWorkerJobs } from "@/services/worker/jobs";

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser(request);

    // Only workers can access this API
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

    // Fetch worker jobs
    const assignedJobs = await getWorkerJobs(user.userId);

    return NextResponse.json(
      {
        success: true,
        jobs: assignedJobs,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
  console.error("========== WORKER JOBS ERROR ==========");
  console.error(error);
  console.error("======================================");

  return NextResponse.json(
    {
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    },
    {
      status: 500,
    }
  );
}
}
