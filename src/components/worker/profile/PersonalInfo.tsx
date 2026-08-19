"use client";

import { Mail, Phone, FileText, Briefcase } from "lucide-react";
import { WorkerProfile } from "@/types/workerProfile";
import { ReactNode } from "react";

interface Props {
  profile: WorkerProfile;
}

export default function PersonalInfo({ profile }: Props) {
  return (
    <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
      <h2 className="text-lg font-bold text-gray-900">Personal Details</h2>
      <p className="text-xs text-gray-400 mt-0.5 mb-6">Contact info and professional bio</p>

      <div className="divide-y divide-gray-100">
        <InfoRow
          icon={<Mail size={16} />}
          title="Email Address"
          value={profile.email}
          bgColor="bg-blue-50 text-blue-600 border border-blue-100"
        />

        <InfoRow
          icon={<Phone size={16} />}
          title="Phone Number"
          value={profile.phone || "Not Configured"}
          bgColor="bg-emerald-50 text-emerald-600 border border-emerald-100"
        />

        <InfoRow
          icon={<Briefcase size={16} />}
          title="Work Experience"
          value={`${profile.experience || 0} Years in Category`}
          bgColor="bg-amber-50 text-amber-600 border border-amber-100"
        />

        <InfoRow
          icon={<FileText size={16} />}
          title="About Bio"
          value={profile.bio || "No biography added yet."}
          bgColor="bg-indigo-50 text-indigo-600 border border-indigo-100"
        />
      </div>
    </div>
  );
}

interface InfoRowProps {
  icon: ReactNode;
  title: string;
  value: string;
  bgColor: string;
}

function InfoRow({ icon, title, value, bgColor }: InfoRowProps) {
  return (
    <div className="flex gap-4 py-4 first:pt-0 last:pb-0">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bgColor}`}>
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          {title}
        </p>

        <p className="mt-0.5 text-sm font-semibold text-gray-800 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}
