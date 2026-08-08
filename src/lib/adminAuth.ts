import { NextRequest } from "next/server";
import { getCurrentUser } from "./getCurrentUser";

export async function requireAdmin(request: NextRequest) {
  const user = await getCurrentUser(request);

  if (user.role !== "ADMIN") {
    throw new Error("Access denied. Admin only.");
  }

  return user;
}
