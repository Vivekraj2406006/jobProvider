import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [
      completedJobs,
      activeWorkers,
      totalServices,
      totalCustomers,
    ] = await Promise.all([
      prisma.job.count({
        where: {
          status: "COMPLETED",
        },
      }),

      prisma.worker.count({
        where: {
          isAvailable: true,
        },
      }),

      prisma.service.count({
        where: {
          isActive: true,
        },
      }),

      prisma.user.count({
        where: {
          role: "CUSTOMER",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      completedJobs,
      activeWorkers,
      totalServices,
      totalCustomers,
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
