import { AddressInput, UpdateAddressInput } from "@/types/address";

function isValidLatitude(value: number) {
  return value >= -90 && value <= 90;
}

function isValidLongitude(value: number) {
  return value >= -180 && value <= 180;
}

function validateCommonFields(
  data: Record<string, unknown>,
  isUpdate = false,
) {
  if (!isUpdate || data.label !== undefined) {
    if (
      typeof data.label !== "string" ||
      data.label.trim().length === 0
    ) {
      throw new Error("Address label is required");
    }
  }

  if (!isUpdate || data.name !== undefined) {
    if (
      typeof data.name !== "string" ||
      data.name.trim().length < 2
    ) {
      throw new Error("Valid name is required");
    }
  }

  if (!isUpdate || data.phone !== undefined) {
    if (
      typeof data.phone !== "string" ||
      !/^[6-9]\d{9}$/.test(data.phone.trim())
    ) {
      throw new Error("Valid 10-digit phone number is required");
    }
  }

  if (!isUpdate || data.addressLine !== undefined) {
    if (
      typeof data.addressLine !== "string" ||
      data.addressLine.trim().length < 5
    ) {
      throw new Error("Valid address is required");
    }
  }

  if (!isUpdate || data.city !== undefined) {
    if (
      typeof data.city !== "string" ||
      data.city.trim().length < 2
    ) {
      throw new Error("Valid city is required");
    }
  }

  if (!isUpdate || data.state !== undefined) {
    if (
      typeof data.state !== "string" ||
      data.state.trim().length < 2
    ) {
      throw new Error("Valid state is required");
    }
  }

  if (!isUpdate || data.pincode !== undefined) {
    if (
      typeof data.pincode !== "string" ||
      !/^\d{6}$/.test(data.pincode.trim())
    ) {
      throw new Error("Valid 6-digit pincode is required");
    }
  }

  if (data.area !== undefined && data.area !== null) {
    if (typeof data.area !== "string") {
      throw new Error("Area must be a string");
    }
  }

  if (data.latitude !== undefined && data.latitude !== null) {
    if (
      typeof data.latitude !== "number" ||
      !Number.isFinite(data.latitude) ||
      !isValidLatitude(data.latitude)
    ) {
      throw new Error("Invalid latitude");
    }
  }

  if (data.longitude !== undefined && data.longitude !== null) {
    if (
      typeof data.longitude !== "number" ||
      !Number.isFinite(data.longitude) ||
      !isValidLongitude(data.longitude)
    ) {
      throw new Error("Invalid longitude");
    }
  }

  if (
    data.isDefault !== undefined &&
    typeof data.isDefault !== "boolean"
  ) {
    throw new Error("isDefault must be a boolean");
  }
}

export function validateAddressInput(
  data: unknown,
): AddressInput {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Invalid address data");
  }

  const input = data as Record<string, unknown>;

  validateCommonFields(input);

  return {
    label: (input.label as string).trim(),
    name: (input.name as string).trim(),
    phone: (input.phone as string).trim(),
    addressLine: (input.addressLine as string).trim(),
    area:
      typeof input.area === "string"
        ? input.area.trim() || null
        : null,
    city: (input.city as string).trim(),
    state: (input.state as string).trim(),
    pincode: (input.pincode as string).trim(),
    latitude:
      typeof input.latitude === "number"
        ? input.latitude
        : null,
    longitude:
      typeof input.longitude === "number"
        ? input.longitude
        : null,
    isDefault:
      typeof input.isDefault === "boolean"
        ? input.isDefault
        : false,
  };
}

export function validateUpdateAddressInput(
  data: unknown,
): UpdateAddressInput {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Invalid address data");
  }

  const input = data as Record<string, unknown>;

  if (Object.keys(input).length === 0) {
    throw new Error("At least one field is required");
  }

  validateCommonFields(input, true);

  const result: UpdateAddressInput = {};

  if (input.label !== undefined) {
    result.label = (input.label as string).trim();
  }

  if (input.name !== undefined) {
    result.name = (input.name as string).trim();
  }

  if (input.phone !== undefined) {
    result.phone = (input.phone as string).trim();
  }

  if (input.addressLine !== undefined) {
    result.addressLine = (input.addressLine as string).trim();
  }

  if (input.area !== undefined) {
    result.area =
      typeof input.area === "string"
        ? input.area.trim() || null
        : null;
  }

  if (input.city !== undefined) {
    result.city = (input.city as string).trim();
  }

  if (input.state !== undefined) {
    result.state = (input.state as string).trim();
  }

  if (input.pincode !== undefined) {
    result.pincode = (input.pincode as string).trim();
  }

  if (input.latitude !== undefined) {
    result.latitude =
      typeof input.latitude === "number"
        ? input.latitude
        : null;
  }

  if (input.longitude !== undefined) {
    result.longitude =
      typeof input.longitude === "number"
        ? input.longitude
        : null;
  }

  if (input.isDefault !== undefined) {
    result.isDefault = input.isDefault as boolean;
  }

  return result;
}
