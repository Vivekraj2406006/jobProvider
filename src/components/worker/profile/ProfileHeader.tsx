"use client";

import { Star, BriefcaseBusiness, UserCircle2, ShieldCheck, Calendar } from "lucide-react";
import { WorkerProfile } from "@/types/workerProfile";

interface ProfileHeaderProps {
  profile: WorkerProfile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-150 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
      {/* Premium Cover Banner Background */}
      <div className="relative h-32 w-full bg-gradient-to-r from-[#2c2217] via-[#3a2f23] to-[#8d6738] sm:h-40">
        <div className="absolute right-0 top-0 h-full w-40 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute left-10 bottom-0 h-12 w-12 rounded-full bg-[#c8a56a]/15 blur-xl" />
      </div>

      {/* Profile Details Container */}
      <div className="relative px-6 pb-6 sm:px-8 sm:pb-8">
        <div className="flex flex-col items-center sm:flex-row sm:items-end sm:gap-6 sm:text-left">
          {/* Floating Avatar */}
          <div className="relative -mt-16 sm:-mt-20 shrink-0">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md sm:h-32 sm:w-32"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gray-50 text-gray-300 shadow-md sm:h-32 sm:w-32">
                <UserCircle2 size={80} className="text-gray-300" />
              </div>
            )}
            {/* Verified badge icon */}
            <span className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white border-2 border-white shadow-sm">
              <ShieldCheck size={14} className="fill-white text-emerald-500" />
            </span>
          </div>

          {/* Name & Skill Chips */}
          <div className="mt-4 flex-1 text-center sm:mt-0 sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
                {profile.name}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                Verified Pro
              </span>
            </div>
            <p className="mt-1.5 text-sm font-semibold text-gray-500">
              {profile.skill && profile.skill.length > 0
                ? profile.skill.join(" • ")
                : "Professional Service Provider"}
            </p>
          </div>
        </div>

        {/* Quick horizontal metric highlights */}
        <div className="mt-8 grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-50 pt-6 text-center sm:max-w-md sm:text-left">
          <div className="px-4 first:pl-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Rating</span>
            <div className="mt-1 flex items-center justify-center gap-1.5 sm:justify-start">
              <Star className="fill-yellow-400 text-yellow-400" size={18} />
              <span className="text-base font-extrabold text-gray-800">
                {profile.rating ? Number(profile.rating).toFixed(1) : "0.0"}
              </span>
            </div>
          </div>

          <div className="px-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Completed</span>
            <div className="mt-1 flex items-center justify-center gap-1.5 sm:justify-start">
              <BriefcaseBusiness className="text-blue-600" size={18} />
              <span className="text-base font-extrabold text-gray-800">
                {profile.completedJobs || 0} Jobs
              </span>
            </div>
          </div>

          <div className="px-4 last:pr-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Experience</span>
            <div className="mt-1 flex items-center justify-center gap-1.5 sm:justify-start">
              <Calendar className="text-amber-600" size={18} />
              <span className="text-base font-extrabold text-gray-800">
                {profile.experience || 0} Yrs
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
