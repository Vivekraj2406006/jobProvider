"use client";

import { useEffect, useState } from "react";
import { Loader2, MapPin, X } from "lucide-react";
import type {
  Address,
  AddressInput,
  UpdateAddressInput,
} from "@/types/address";

interface AddressFormProps {
  address?: Address | null;
  onSubmit: (data: AddressInput | UpdateAddressInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface FormState {
  label: string;
  name: string;
  phone: string;
  addressLine: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const emptyForm: FormState = {
  label: "",
  name: "",
  phone: "",
  addressLine: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

export default function AddressForm({
  address,
  onSubmit,
  onCancel,
  loading = false,
}: AddressFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = Boolean(address);

  useEffect(() => {
    if (address) {
      setForm({
        label: address.label,
        name: address.name,
        phone: address.phone,
        addressLine: address.addressLine,
        area: address.area ?? "",
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: address.isDefault,
      });
    } else {
      setForm(emptyForm);
    }

    setErrors({});
  }, [address]);

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.label.trim()) {
      newErrors.label = "Please enter an address label.";
    }

    if (!form.name.trim()) {
      newErrors.name = "Please enter the recipient name.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Please enter a phone number.";
    } else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }

    if (!form.addressLine.trim()) {
      newErrors.addressLine = "Please enter your address.";
    }

    if (!form.city.trim()) {
      newErrors.city = "Please enter your city.";
    }

    if (!form.state.trim()) {
      newErrors.state = "Please enter your state.";
    }

    if (!form.pincode.trim()) {
      newErrors.pincode = "Please enter your pincode.";
    } else if (!/^\d{6}$/.test(form.pincode.trim())) {
      newErrors.pincode = "Enter a valid 6-digit pincode.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload: AddressInput = {
      label: form.label.trim(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      addressLine: form.addressLine.trim(),
      area: form.area.trim() || null,
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      isDefault: form.isDefault,
    };

    if (address) {
      const updatePayload: UpdateAddressInput = payload;
      await onSubmit(updatePayload);
    } else {
      await onSubmit(payload);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#2F2923] outline-none transition placeholder:text-[#A79B8E] ${
      errors[field]
        ? "border-red-400 focus:border-red-500"
        : "border-[#DED4C8] focus:border-[#1F6F5B]"
    }`;

  return (
    <div className="rounded-2xl border border-[#E7DED2] bg-white p-6 shadow-[0_10px_40px_rgba(47,41,35,0.06)]">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F6F3]">
            <MapPin size={20} className="text-[#1F6F5B]" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#2F2923]">
              {isEditing ? "Edit address" : "Add new address"}
            </h2>

            <p className="mt-1 text-sm text-[#7A6E61]">
              {isEditing
                ? "Update your saved address details."
                : "Add an address for your service bookings."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg p-2 text-[#7A6E61] transition hover:bg-[#F5F1EB] hover:text-[#2F2923] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close form"
        >
          <X size={19} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Address label */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#51483F]">
            Address label
          </label>

          <div className="grid grid-cols-3 gap-2">
            {["Home", "Work", "Other"].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => updateField("label", label)}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  form.label === label
                    ? "border-[#1F6F5B] bg-[#E7F3EE] text-[#1F6F5B]"
                    : "border-[#DED4C8] bg-white text-[#6B5D4D] hover:border-[#BEB1A2]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {errors.label && (
            <p className="mt-1.5 text-xs text-red-500">{errors.label}</p>
          )}
        </div>

        {/* Name + Phone */}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="address-name"
              className="mb-2 block text-sm font-medium text-[#51483F]"
            >
              Full name
            </label>

            <input
              id="address-name"
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Enter full name"
              className={inputClass("name")}
              disabled={loading}
            />

            {errors.name && (
              <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="address-phone"
              className="mb-2 block text-sm font-medium text-[#51483F]"
            >
              Phone number
            </label>

            <input
              id="address-phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={form.phone}
              onChange={(e) =>
                updateField(
                  "phone",
                  e.target.value.replace(/\D/g, "").slice(0, 10),
                )
              }
              placeholder="10-digit phone number"
              className={inputClass("phone")}
              disabled={loading}
            />

            {errors.phone && (
              <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Address line */}
        <div>
          <label
            htmlFor="address-line"
            className="mb-2 block text-sm font-medium text-[#51483F]"
          >
            Address
          </label>

          <textarea
            id="address-line"
            rows={3}
            value={form.addressLine}
            onChange={(e) => updateField("addressLine", e.target.value)}
            placeholder="House / Flat / Building / Street"
            className={`${inputClass("addressLine")} resize-none`}
            disabled={loading}
          />

          {errors.addressLine && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.addressLine}
            </p>
          )}
        </div>

        {/* Area */}
        <div>
          <label
            htmlFor="address-area"
            className="mb-2 block text-sm font-medium text-[#51483F]"
          >
            Area / Locality
            <span className="ml-1 font-normal text-[#9A8E81]">
              (optional)
            </span>
          </label>

          <input
            id="address-area"
            type="text"
            value={form.area}
            onChange={(e) => updateField("area", e.target.value)}
            placeholder="Enter area or locality"
            className={inputClass("area")}
            disabled={loading}
          />
        </div>

        {/* City / State / Pincode */}
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label
              htmlFor="address-city"
              className="mb-2 block text-sm font-medium text-[#51483F]"
            >
              City
            </label>

            <input
              id="address-city"
              type="text"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="City"
              className={inputClass("city")}
              disabled={loading}
            />

            {errors.city && (
              <p className="mt-1.5 text-xs text-red-500">{errors.city}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="address-state"
              className="mb-2 block text-sm font-medium text-[#51483F]"
            >
              State
            </label>

            <input
              id="address-state"
              type="text"
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
              placeholder="State"
              className={inputClass("state")}
              disabled={loading}
            />

            {errors.state && (
              <p className="mt-1.5 text-xs text-red-500">{errors.state}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="address-pincode"
              className="mb-2 block text-sm font-medium text-[#51483F]"
            >
              Pincode
            </label>

            <input
              id="address-pincode"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={form.pincode}
              onChange={(e) =>
                updateField(
                  "pincode",
                  e.target.value.replace(/\D/g, "").slice(0, 6),
                )
              }
              placeholder="6-digit pincode"
              className={inputClass("pincode")}
              disabled={loading}
            />

            {errors.pincode && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.pincode}
              </p>
            )}
          </div>
        </div>

        {/* Default address */}
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E7DED2] bg-[#FBF9F6] p-4">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => updateField("isDefault", e.target.checked)}
            disabled={loading}
            className="h-4 w-4 accent-[#1F6F5B]"
          />

          <div>
            <p className="text-sm font-semibold text-[#51483F]">
              Set as default address
            </p>
            <p className="mt-0.5 text-xs text-[#8B7D6E]">
              Use this address automatically for future bookings.
            </p>
          </div>
        </label>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-[#DED4C8] px-5 py-3 text-sm font-semibold text-[#6B5D4D] transition hover:bg-[#F5F1EB] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F6F5B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#185846] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={17} className="animate-spin" />}

            {loading
              ? isEditing
                ? "Saving..."
                : "Adding..."
              : isEditing
                ? "Save changes"
                : "Add address"}
          </button>
        </div>
      </form>
    </div>
  );
}
