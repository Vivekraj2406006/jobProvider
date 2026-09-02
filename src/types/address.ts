export interface Address {
  id: string;
  userId: string;
  label: string;
  name: string;
  phone: string;
  addressLine: string;
  area: string | null;
  city: string;
  state: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressInput {
  label: string;
  name: string;
  phone: string;
  addressLine: string;
  area?: string | null;
  city: string;
  state: string;
  pincode: string;
  latitude?: number | null;
  longitude?: number | null;
  isDefault?: boolean;
}

export interface UpdateAddressInput {
  label?: string;
  name?: string;
  phone?: string;
  addressLine?: string;
  area?: string | null;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number | null;
  longitude?: number | null;
  isDefault?: boolean;
}
