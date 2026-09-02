"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  Address,
  AddressInput,
  UpdateAddressInput,
} from "@/types/address";

import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "@/lib/api/addressApi";

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAddresses();

      setAddresses(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load addresses";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAddresses();
  }, [refreshAddresses]);

  const addAddress = useCallback(
    async (input: AddressInput) => {
      try {
        setError(null);

        const address = await createAddress(input);

        setAddresses((current) => {
          if (address.isDefault) {
            return [
              address,
              ...current.map((item) => ({
                ...item,
                isDefault: false,
              })),
            ];
          }

          return [address, ...current];
        });

        return address;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create address";

        setError(message);
        throw error;
      }
    },
    [],
  );

  const editAddress = useCallback(
    async (
      addressId: string,
      input: UpdateAddressInput,
    ) => {
      try {
        setError(null);

        const updatedAddress = await updateAddress(
          addressId,
          input,
        );

        setAddresses((current) =>
          current.map((address) =>
            address.id === updatedAddress.id
              ? updatedAddress
              : updatedAddress.isDefault
                ? {
                    ...address,
                    isDefault: false,
                  }
                : address,
          ),
        );

        return updatedAddress;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update address";

        setError(message);
        throw error;
      }
    },
    [],
  );

  const removeAddress = useCallback(
    async (addressId: string) => {
      try {
        setError(null);

        await deleteAddress(addressId);

        setAddresses((current) => {
          const deletedAddress = current.find(
            (address) => address.id === addressId,
          );

          const remaining = current.filter(
            (address) => address.id !== addressId,
          );

          // The backend automatically promotes another
          // address when the default address is deleted.
          // Refreshing keeps the client state authoritative.
          if (deletedAddress?.isDefault && remaining.length > 0) {
            return remaining;
          }

          return remaining;
        });

        if (
          addresses.some(
            (address) =>
              address.id === addressId &&
              address.isDefault,
          )
        ) {
          await refreshAddresses();
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete address";

        setError(message);
        throw error;
      }
    },
    [addresses, refreshAddresses],
  );

  const setDefaultAddress = useCallback(
    async (addressId: string) => {
      try {
        setError(null);

        const updatedAddress = await updateAddress(
          addressId,
          {
            isDefault: true,
          },
        );

        setAddresses((current) =>
          current.map((address) => ({
            ...address,
            isDefault:
              address.id === updatedAddress.id,
          })),
        );

        return updatedAddress;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to set default address";

        setError(message);
        throw error;
      }
    },
    [],
  );

  return {
    addresses,
    loading,
    error,
    addAddress,
    editAddress,
    removeAddress,
    setDefaultAddress,
    refreshAddresses,
  };
}
