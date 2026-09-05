import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await params;

    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found",
        },
        { status: 404 }
      );
    }

    if (!service.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Service is not available",
        },
        { status: 400 }
      );
    }

    const packages = await prisma.servicePackage.findMany({
      where: {
        serviceId,
        isActive: true,
      },
      orderBy: {
        price: "asc",
      },
      select: {
        id: true,
        serviceId: true,
        name: true,
        description: true,
        price: true,
        durationMin: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      service,
      packages,
    });
  } catch (error) {
    console.error("Get service packages error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
