import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireWorker } from "@/lib/permissions";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireWorker(request);

    const worker = await prisma.worker.findUnique({
      where: {
        userId: user.userId,
      },
    });

    if (!worker) {
      return NextResponse.json(
        {
          success: false,
          message: "Worker not found",
        },
        {
          status: 404,
        }
      );
    }

    const job = await prisma.job.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          message: "Job not found",
        },
        {
          status: 404,
        }
      );
    }

    if (job.workerId !== worker.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 403,
        }
      );
    }

    if (job.status !== "PENDING_ACCEPTANCE") {
      return NextResponse.json(
        {
          success: false,
          message: "Job is not awaiting acceptance",
        },
        {
          status: 400,
        }
      );
    }

    const updatedJob = await prisma.job.update({
      where: {
        id: job.id,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Job accepted",
      job: updatedJob,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
