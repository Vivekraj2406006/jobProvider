import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function getCurrentUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    throw new Error("Authorization header missing");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Invalid Authorization header");
  }

  const token = authHeader.substring(7);

  console.log("JWT Token:", token);

  return verifyToken(token);
}
