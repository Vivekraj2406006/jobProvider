import { NextRequest, NextResponse } from "next/server";

import { requireCustomer } from "@/lib/permissions";

import {
  deleteAddress,
  getAddressById,
  updateAddress,
} from "@/services/address.service";

import { validateUpdateAddressInput } from "@/validations/address.schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireCustomer(request);

    const { id } = await params;

    const address = await getAddressById(user.userId, id);

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          message: "Address not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        address,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get Address Error:", error);

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireCustomer(request);

    const { id } = await params;

    const body = await request.json();

    const data = validateUpdateAddressInput(body);

    const address = await updateAddress(user.userId, id, data);

    return NextResponse.json(
      {
        success: true,
        message: "Address updated successfully",
        address,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update Address Error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    if (message === "Address not found") {
      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 404 },
      );
    }

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireCustomer(request);

    const { id } = await params;

    await deleteAddress(user.userId, id);

    return NextResponse.json(
      {
        success: true,
        message: "Address deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete Address Error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    if (message === "Address not found") {
      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 404 },
      );
    }

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
