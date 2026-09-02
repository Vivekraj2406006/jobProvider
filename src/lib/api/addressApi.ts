import type {
  Address,
  AddressInput,
  UpdateAddressInput,
} from "@/types/address";

const API_URL = "/api/addresses";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data as T;
}

interface AddressesResponse {
  success: boolean;
  addresses: Address[];
}

interface AddressResponse {
  success: boolean;
  address: Address;
  message?: string;
}

interface DeleteAddressResponse {
  success: boolean;
  message: string;
}

export async function getAddresses(): Promise<Address[]> {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  const data = await handleResponse<AddressesResponse>(response);

  return data.addresses;
}

export async function getAddress(addressId: string): Promise<Address> {
  const response = await fetch(`${API_URL}/${addressId}`, {
    method: "GET",
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  const data = await handleResponse<AddressResponse>(response);

  return data.address;
}

export async function createAddress(input: AddressInput): Promise<Address> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  });

  const data = await handleResponse<AddressResponse>(response);

  return data.address;
}

export async function updateAddress(
  addressId: string,
  input: UpdateAddressInput,
): Promise<Address> {
  const response = await fetch(`${API_URL}/${addressId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  });

  const data = await handleResponse<AddressResponse>(response);

  return data.address;
}

export async function deleteAddress(addressId: string): Promise<string> {
  const response = await fetch(`${API_URL}/${addressId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await handleResponse<DeleteAddressResponse>(response);

  return data.message;
}
