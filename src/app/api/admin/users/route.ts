import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/adminAuth";
import { getAllUsers } from "@/services/admin/users";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const users = await getAllUsers();

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);

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
