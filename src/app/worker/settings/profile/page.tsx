"use client";

import { useEffect, useState } from "react";
import { Camera, Check, Edit3, MapPin, User } from "lucide-react";
import { useWorkerProfile } from "@/hooks/useWorkerProfile";
import type { WorkerProfile } from "@/types/workerProfile";

export default function WorkerProfileSettingsPage() {
  const { profile, loading, error, refresh } = useWorkerProfile();

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    bio: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    experience: "",
  });

  useEffect(() => {
    if (!profile) return;

    setForm({
      name: profile.name || "",
      phone: profile.phone || "",
      email: profile.email || "",
      bio: profile.bio || "",
      area: profile.area || "",
      city: profile.city || "",
      state: profile.state || "",
      pincode: profile.pincode || "",
      experience: String(profile.experience || 0),
    });
  }, [profile]);

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-5 p-6">
        <div className="h-32 animate-pulse rounded-2xl bg-gray-200" />
        <div className="h-96 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center p-10 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          Failed to load profile
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {error}
        </p>

        <button
          onClick={refresh}
          className="mt-5 rounded-xl bg-[#146356] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <User className="mx-auto text-gray-400" size={40} />

          <h2 className="mt-3 text-xl font-bold">
            Worker profile not found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            We could not find your worker profile.
          </p>
        </div>
      </div>
    );
  }

  const initials = profile.name
    ?.split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const location = [
    profile.area,
    profile.city,
    profile.state,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-[#f5f8f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#10201b]">
            Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and professional profile.
          </p>
        </div>

        {/* Profile Card */}
        <div className="mb-6 rounded-2xl bg-[#182b26] p-6 text-white shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#e8a23a] text-2xl font-bold text-[#2b1a05]">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials || "W"
                )}
              </div>

              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#182b26] bg-[#e8a23a] text-[#182b26]"
              >
                <Camera size={14} />
              </button>
            </div>

            {/* Basic info */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">
                  {profile.name}
                </h2>

                <span className="rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-semibold text-green-300">
                  Verified
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-300">
                {profile.skill?.[0] || "Service Professional"}
              </p>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-300">
                <span>
                  ⭐ {profile.rating?.toFixed(1) || "0.0"} rating
                </span>

                <span>
                  ✓ {profile.completedJobs || 0} jobs completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Card Header */}
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-[#10201b]">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Keep your contact and profile information updated.
              </p>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                <Edit3 size={15} />
                <span className="hidden sm:inline">
                  Edit
                </span>
              </button>
            )}
          </div>

          {/* Fields */}
          <div className="p-5 sm:p-6">

            <div className="grid gap-5 sm:grid-cols-2">

              {/* Name */}
              <Field
                label="Full Name"
                value={form.name}
                editing={editing}
                onChange={(value) =>
                  updateField("name", value)
                }
              />

              {/* Phone */}
              <Field
                label="Phone Number"
                value={form.phone}
                editing={editing}
                type="tel"
                onChange={(value) =>
                  updateField("phone", value)
                }
              />

              {/* Email */}
              <Field
                label="Email Address"
                value={form.email}
                editing={editing}
                type="email"
                onChange={(value) =>
                  updateField("email", value)
                }
              />

              {/* Experience */}
              <Field
                label="Experience"
                value={`${form.experience} years`}
                editing={editing}
                inputValue={form.experience}
                type="number"
                onChange={(value) =>
                  updateField("experience", value)
                }
              />

              {/* Area */}
              <Field
                label="Area"
                value={form.area}
                editing={editing}
                onChange={(value) =>
                  updateField("area", value)
                }
              />

              {/* City */}
              <Field
                label="City"
                value={form.city}
                editing={editing}
                onChange={(value) =>
                  updateField("city", value)
                }
              />

              {/* State */}
              <Field
                label="State"
                value={form.state}
                editing={editing}
                onChange={(value) =>
                  updateField("state", value)
                }
              />

              {/* Pincode */}
              <Field
                label="Pincode"
                value={form.pincode}
                editing={editing}
                type="text"
                onChange={(value) =>
                  updateField("pincode", value)
                }
              />

              {/* Bio */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  About You
                </label>

                {editing ? (
                  <textarea
                    value={form.bio}
                    onChange={(event) =>
                      updateField("bio", event.target.value)
                    }
                    rows={4}
                    placeholder="Tell customers about your experience and services..."
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#146356] focus:ring-2 focus:ring-[#146356]/10"
                  />
                ) : (
                  <div className="min-h-[90px] rounded-xl bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-600">
                    {form.bio || "No bio added yet."}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            {!editing && location && (
              <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#f3f7f5] p-4">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-[#146356]"
                />

                <div>
                  <p className="text-sm font-semibold text-[#10201b]">
                    Service Location
                  </p>

                  <p className="mt-1 break-words text-sm text-gray-500">
                    {location}
                    {profile.pincode
                      ? ` - ${profile.pincode}`
                      : ""}
                  </p>
                </div>
              </div>
            )}

            {/* Buttons */}
            {editing && (
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      name: profile.name || "",
                      phone: profile.phone || "",
                      email: profile.email || "",
                      bio: profile.bio || "",
                      area: profile.area || "",
                      city: profile.city || "",
                      state: profile.state || "",
                      pincode: profile.pincode || "",
                      experience: String(
                        profile.experience || 0
                      ),
                    });

                    setEditing(false);
                  }}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#146356] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#105448]"
                >
                  <Check size={16} />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reusable field */

function Field({
  label,
  value,
  inputValue,
  editing,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  inputValue?: string;
  editing: boolean;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      {editing ? (
        <input
          type={type}
          value={inputValue ?? value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="w-full min-w-0 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#146356] focus:ring-2 focus:ring-[#146356]/10"
        />
      ) : (
        <div className="min-w-0 overflow-hidden rounded-xl bg-gray-50 px-4 py-3">
          <p className="break-words text-sm font-medium text-[#10201b]">
            {value || "Not provided"}
          </p>
        </div>
      )}
    </div>
  );
}
