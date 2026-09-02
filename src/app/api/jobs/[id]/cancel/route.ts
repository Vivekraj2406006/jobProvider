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

    if (job.customerId !== user.userId) {
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
          status: "CANCELLED",
        },
      }),

      ...(job.workerId
        ? [
            prisma.worker.update({
              where: {
                id: job.workerId,
              },
              data: {
                isAvailable: true,
              },
            }),
          ]
        : []),
    ]);

    return NextResponse.json({
      success: true,
      message: "Job cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel Job Error:", error);

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
