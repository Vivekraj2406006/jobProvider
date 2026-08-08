import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { getWorkerJobDetails } from "@/services/worker/jobDetails";
import { updateJobStatus } from "@/services/worker/jobWorkflow";
import { JobAction } from "@/types/jobAction";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request);

    const { id } = await params;

    const job = await getWorkerJobDetails(user.userId, id);

    return NextResponse.json(
      {
        success: true,
        job,
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

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request);

    const { id } = await params;

    const { action } = await request.json();

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

    const updatedJob = await updateJobStatus(
      user.userId,
      id,
      action as JobAction,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Job updated successfully.",
        job: updatedJob,
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
