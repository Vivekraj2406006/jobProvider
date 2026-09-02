import { NextRequest, NextResponse } from "next/server";

import { requireCustomer } from "@/lib/permissions";

import { createAddress, getUserAddresses } from "@/services/address.service";

import { validateAddressInput } from "@/validations/address.schema";

export async function GET(request: NextRequest) {
  try {
    const user = await requireCustomer(request);

    const addresses = await getUserAddresses(user.userId);

    return NextResponse.json(
      {
        success: true,
        addresses,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get Addresses Error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    if (
      message.includes("Unauthorized") ||
      message.includes("access required") ||
      message.includes("Authorization")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireCustomer(request);

    const body = await request.json();

    const data = validateAddressInput(body);

    const address = await createAddress(user.userId, data);

    return NextResponse.json(
      {
        success: true,
        message: "Address created successfully",
        address,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create Address Error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    if (
      message.includes("Unauthorized") ||
      message.includes("access required") ||
      message.includes("Authorization")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    if (
      message.includes("required") ||
      message.includes("Invalid") ||
      message.includes("Valid") ||
      message.includes("must be")
    ) {
      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
