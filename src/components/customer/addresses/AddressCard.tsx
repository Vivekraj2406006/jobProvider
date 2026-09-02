"use client";

import {
  Check,
  Edit2,
  MapPin,
  Phone,
  Star,
  Trash2,
} from "lucide-react";

import type { Address } from "@/types/address";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  return (
    <div
      className={`relative rounded-2xl border bg-white p-5 transition ${
        address.isDefault
          ? "border-[#1F6F5B] shadow-[0_8px_30px_rgba(31,111,91,0.08)]"
          : "border-[#E7DED2] hover:border-[#CFC3B4]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0F6F3]">
            <MapPin
              size={19}
              className="text-[#1F6F5B]"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-[#2F2923]">
                {address.label}
              </h3>

              {address.isDefault && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F3EE] px-2.5 py-1 text-xs font-medium text-[#1F6F5B]">
                  <Check size={12} />
                  Default
                </span>
              )}
            </div>

            <p className="mt-1 text-sm font-medium text-[#51483F]">
              {address.name}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(address)}
            className="rounded-lg p-2 text-[#6B5D4D] transition hover:bg-[#F5F1EB] hover:text-[#2F2923]"
            aria-label="Edit address"
          >
            <Edit2 size={17} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(address)}
            className="rounded-lg p-2 text-[#8B6B62] transition hover:bg-[#FBEFED] hover:text-[#A33A2B]"
            aria-label="Delete address"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-[#6B5D4D]">
        <p className="leading-6">
          {address.addressLine}
          {address.area
            ? `, ${address.area}`
            : ""}
          , {address.city}, {address.state}{" "}
          - {address.pincode}
        </p>

        <div className="flex items-center gap-2">
          <Phone size={15} />
          <span>{address.phone}</span>
        </div>
      </div>

      {!address.isDefault && (
        <button
          type="button"
          onClick={() => onSetDefault(address)}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1F6F5B] transition hover:text-[#155443]"
        >
          <Star size={15} />
          Set as default
        </button>
      )}
    </div>
  );
}
