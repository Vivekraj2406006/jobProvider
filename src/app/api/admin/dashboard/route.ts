import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/adminAuth";
import { getAdminDashboard } from "@/services/admin/dashboard";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const dashboard = await getAdminDashboard();

    return NextResponse.json(
      {
        success: true,
        dashboard,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
