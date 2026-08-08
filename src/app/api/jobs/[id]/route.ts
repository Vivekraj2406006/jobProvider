import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    await getCurrentUser(request);

    const { id } = await context.params;

    const job = await prisma.job.findUnique({
      where: {
        id,
      },

      include: {
        service: true,

        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        worker: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
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
    console.error("Get Job Error:", error);

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
