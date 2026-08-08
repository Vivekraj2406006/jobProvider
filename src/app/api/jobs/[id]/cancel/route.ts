import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest,NextResponse } from "next/server";

export async function PATCH(request:NextRequest,{params}:{params:{id:string}}) {
  try {
    const user = await getCurrentUser(request)
    const job = await prisma.job.findUnique({where:{id:params.id}})
    if(!job) return NextResponse.json({success:false,message:"job not found"},{status:404})

      if (job.customerId !== user.userId) {
        return NextResponse.json({success: false, message:"Unauthorized",},{status: 403});
      }

      await prisma.$transaction([
        prisma.job.update({where:{id:job.id},data:{status:"CANCELLED"}}),
        ...(job.workerId?[prisma.worker.update({where:{id:job.workerId},data:{isAvailable: true}})]:[])
      ])

      return NextResponse.json({
      success: true,
      message: "Job cancelled successfully",
    });
  } catch (error) {
      return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
