import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [
      workers,
      completedJobs,
      services,
    ] = await Promise.all([
      prisma.worker.count({
        where: {
          isAvailable: true,
        },
      }),

      prisma.job.count({
        where: {
          status: "COMPLETED",
        },
      }),

      prisma.service.findMany({
        where: {
          isActive: true,
        },
        take: 6,
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      workers,
      completedJobs,
      services,
      rating: 4.8,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
