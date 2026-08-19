"use client";

import {
  AvailabilityCard,
  LocationCard,
  PersonalInfo,
  ProfileHeader,
  SkillsCard,
} from "@/components/worker/profile";
import { useWorkerProfile } from "@/hooks/useWorkerProfile";
import { RefreshCw, AlertCircle, UserCircle2 } from "lucide-react";

export default function WorkerProfilePage() {
  const { profile, loading, error, refresh } = useWorkerProfile();

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Shimmer */}
        <div className="h-64 rounded-3xl bg-gray-200" />

        {/* Content Shimmer Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-32 rounded-3xl bg-gray-200" />
            <div className="h-64 rounded-3xl bg-gray-200" />
          </div>
          <div className="space-y-8">
            <div className="h-36 rounded-3xl bg-gray-200" />
            <div className="h-80 rounded-3xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600 border border-rose-100 mb-4">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Failed to load Profile</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">{error}</p>
        <button
          onClick={refresh}
          className="mt-6 flex items-center gap-2 rounded-xl bg-[#c8a56a] hover:bg-[#b08e54] text-white px-5 py-3 font-semibold transition"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400 border border-gray-150 mb-4">
          <UserCircle2 size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Worker Profile Not Found</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          We couldn't locate a valid service provider record associated with your user session.
        </p>
        <button
          onClick={refresh}
          className="mt-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Check Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Partner Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            View public portfolio stats, location territories, and contact records.
          </p>
        </div>

        <button
          onClick={refresh}
          className="self-start flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
        >
          <RefreshCw size={14} className="text-gray-500" />
          Sync Profile
        </button>
      </div>

      {/* Grid layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content (Left Column) */}
        <div className="lg:col-span-2 space-y-8">
          <ProfileHeader profile={profile} />

          <SkillsCard skills={profile.skill} />

          <LocationCard
            area={profile.area}
            city={profile.city}
            state={profile.state}
            pincode={profile.pincode}
          />
        </div>

        {/* Sidebar Status (Right Column) */}
        <div className="space-y-8">
          <AvailabilityCard available={profile.isAvailable} />

          <PersonalInfo profile={profile} />
        </div>
      </div>
    </div>
  );
}
