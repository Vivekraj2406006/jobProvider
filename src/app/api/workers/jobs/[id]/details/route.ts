import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { getWorkerJobDetails } from "@/services/worker/jobDetails";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request);

    const { id } = await params;

    const job = await getWorkerJobDetails(user.userId, id);

    return NextResponse.json({
      success: true,
      job,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
