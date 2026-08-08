import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest,NextResponse } from "next/server";

export async function PATCH(request:NextRequest) {
  try {
    const user = await getCurrentUser(request)
    const {latitude, longitude} = await request.json()

    if(typeof latitude !== "number" || typeof longitude !== "number") {
      return NextResponse.json({success: false,message: "Invalid coordinates",},{status: 400});
    }

    const worker = await prisma.worker.update({where: {userId: user.userId},data:{latitude,longitude}});
    return NextResponse.json({success: true,message: "Location updated",worker},{status: 200});
  } catch (error) {
    return NextResponse.json({success: false,message: "Internal server error"},{status: 500});
  }
}
