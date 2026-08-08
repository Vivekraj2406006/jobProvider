import { NextRequest } from "next/server";
import { getCurrentUser } from "./getCurrentUser";

export async function requireWorker(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (user.role !== "WORKER") {
    throw new Error("Worker access required");
  }
  return user;
}

export async function requireCustomer(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (user.role !== "CUSTOMER") {
    throw new Error("Customer access required");
  }
  return user;
}
