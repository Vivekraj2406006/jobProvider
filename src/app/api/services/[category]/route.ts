import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    const categoryMap: Record<string, string> = {
      "home-services": "Home Services",
      cleaning: "Cleaning",
      "appliance-repair": "Appliance Repair",
      "beauty-wellness": "Beauty & Wellness",
      automotive: "Automotive",
      technology: "Technology",
    };

    const categoryName = categoryMap[category];

    if (!categoryName) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid service category",
        },
        { status: 400 }
      );
    }

    const services = await prisma.service.findMany({
      where: {
        category: categoryName,
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      services,
    });
  } catch (error) {
    console.error("Get services by category error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
