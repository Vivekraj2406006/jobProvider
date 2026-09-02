"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, MapPin, Plus } from "lucide-react";
import Link from "next/link";

import AddressCard from "@/components/customer/addresses/AddressCard";
import AddressForm from "@/components/customer/addresses/AddressForm";
import { useAddresses } from "@/hooks/useAddresses";

import type {
  Address,
  AddressInput,
  UpdateAddressInput,
} from "@/types/address";

export default function CustomerAddressesPage() {
  const {
    addresses,
    loading,
    error,
    addAddress,
    editAddress,
    removeAddress,
    setDefaultAddress,
  } = useAddresses();

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleAddClick = () => {
    setEditingAddress(null);
    setActionError(null);
    setShowForm(true);
  };

  const handleEditClick = (address: Address) => {
    setEditingAddress(address);
    setActionError(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    if (actionLoading) return;

    setShowForm(false);
    setEditingAddress(null);
    setActionError(null);
  };

  const handleSubmit = async (
    data: AddressInput | UpdateAddressInput,
  ) => {
    try {
      setActionLoading(true);
      setActionError(null);

      if (editingAddress) {
        await editAddress(editingAddress.id, data);
      } else {
        await addAddress(data as AddressInput);
      }

      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setActionError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (address: Address) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete your ${address.label.toLowerCase()} address?`,
    );

    if (!confirmed) return;

    try {
      setActionError(null);
      setActionLoading(true);

      await removeAddress(address.id);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete address.";

      setActionError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetDefault = async (address: Address) => {
    try {
      setActionError(null);
      setActionLoading(true);

      await setDefaultAddress(address.id);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update default address.";

      setActionError(message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F7F5]">
      {/* Header */}
      <div className="border-b border-[#E7DED2] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/customer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7DED2] text-[#6B5D4D] transition hover:bg-[#F5F1EB] hover:text-[#2F2923]"
                aria-label="Back to customer dashboard"
              >
                <ArrowLeft size={18} />
              </Link>

              <div>
                <h1 className="text-xl font-bold text-[#2F2923] sm:text-2xl">
                  My addresses
                </h1>

                <p className="mt-1 text-sm text-[#7A6E61]">
                  Manage your saved service addresses.
                </p>
              </div>
            </div>

            {!showForm && !loading && (
              <button
                type="button"
                onClick={handleAddClick}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1F6F5B] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#185846]"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add address</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Form */}
        {showForm && (
          <div className="mx-auto mb-8 max-w-3xl">
            {actionError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {actionError}
              </div>
            )}

            <AddressForm
              address={editingAddress}
              onSubmit={handleSubmit}
              onCancel={handleCancelForm}
              loading={actionLoading}
            />
          </div>
        )}

        {/* General error */}
        {!showForm && (error || actionError) && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {actionError || error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-[#6B5D4D]">
              <Loader2
                size={20}
                className="animate-spin text-[#1F6F5B]"
              />
              Loading your addresses...
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && addresses.length === 0 && !showForm && (
          <div className="mx-auto max-w-xl rounded-2xl border border-[#E7DED2] bg-white px-6 py-12 text-center shadow-[0_10px_40px_rgba(47,41,35,0.05)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0F6F3]">
              <MapPin
                size={28}
                className="text-[#1F6F5B]"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-[#2F2923]">
              No saved addresses
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#7A6E61]">
              Add your home, work, or another address so you can book services
              faster.
            </p>

            <button
              type="button"
              onClick={handleAddClick}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1F6F5B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#185846]"
            >
              <Plus size={18} />
              Add your first address
            </button>
          </div>
        )}

        {/* Address list */}
        {!loading && addresses.length > 0 && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#2F2923]">
                  Saved addresses
                </h2>

                <p className="mt-1 text-sm text-[#7A6E61]">
                  {addresses.length}{" "}
                  {addresses.length === 1 ? "address" : "addresses"} saved
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                />
              ))}
            </div>
          </section>
        )}

        {/* Add button below cards */}
        {!loading && addresses.length > 0 && !showForm && (
          <div className="mt-6">
            <button
              type="button"
              onClick={handleAddClick}
              className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[#BEB1A2] px-5 py-3 text-sm font-semibold text-[#1F6F5B] transition hover:border-[#1F6F5B] hover:bg-[#F0F6F3]"
            >
              <Plus size={18} />
              Add another address
            </button>
          </div>
        )}
      </div>

      {/* Global action overlay */}
      {actionLoading && !showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
          <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-xl">
            <Loader2
              size={19}
              className="animate-spin text-[#1F6F5B]"
            />
            <span className="text-sm font-medium text-[#51483F]">
              Updating...
            </span>
          </div>
        </div>
      )}
    </main>
  );
}
