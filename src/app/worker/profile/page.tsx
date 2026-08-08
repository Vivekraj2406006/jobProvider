"use client";

import {
  AvailabilityCard,
  LocationCard,
  PersonalInfo,
  ProfileHeader,
  SkillsCard,
} from "@/components/worker/profile";

import { useWorkerProfile } from "@/hooks/useWorkerProfile";

export default function WorkerProfilePage() {
  const { profile, loading, error } = useWorkerProfile();

  if (loading) {
    return <div className="p-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="rounded-xl bg-red-50 p-6 text-red-600">{error}</div>;
  }

  if (!profile) {
    return <div className="p-8 text-gray-500">Worker profile not found.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <ProfileHeader profile={profile} />

      <div className="grid gap-6 lg:grid-cols-2">
        <PersonalInfo profile={profile} />

        <AvailabilityCard available={profile.isAvailable} />
      </div>

      <SkillsCard skills={profile.skill} />

      <LocationCard
        area={profile.area}
        city={profile.city}
        state={profile.state}
        pincode={profile.pincode}
      />
    </div>
  );
}
