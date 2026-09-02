import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser(request);

    const { id } = await params;

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
        },
      );
    }

    const job = await prisma.job.findUnique({
      where: {
        id,
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
        },
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
        },
      );
    }

    await prisma.$transaction([
      prisma.job.update({
        where: {
          id: job.id,
        },
        data: {
          status: "COMPLETED",
        },
      }),

      prisma.worker.update({
        where: {
          id: worker.id,
        },
        data: {
          isAvailable: true,
          completedJobs: {
            increment: 1,
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Job completed",
    });
  } catch (error) {
    console.error("Complete Job Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
