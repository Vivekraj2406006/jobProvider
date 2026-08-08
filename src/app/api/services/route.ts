import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const services = await prisma.service.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      category: "asc",
    },
  });

  console.log(services[0]);

  return NextResponse.json({
    success: true,
    services,
  });
}
