import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest,NextResponse } from "next/server";

export async function PATCH(request:NextRequest) {
  try {
    const user = await getCurrentUser(request)
    const { isAvailable } = await request.json();

    if (typeof isAvailable !== "boolean") {
    return NextResponse.json(
      {success: false,message: "isAvailable must be boolean"},{status: 400}
    );
    }
    const worker = await prisma.worker.update({where: {userId: user.userId},data: {isAvailable}});
    return NextResponse.json({ success: true, message: "Availability updated", worker},{status: 200});
  } catch (error) {
  return NextResponse.json({success: false,message: "Internal server error",},{status: 500});
  }
  }

