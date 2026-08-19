"use client";

import { Calendar } from "lucide-react";

interface DashboardHeaderProps {
  workerName: string;
}

export default function DashboardHeader({ workerName }: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const initials = workerName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "W";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2c2217] via-[#3a2f23] to-[#8d6738] p-6 text-white shadow-xl md:p-8">
      {/* Decorative background vectors */}
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#c8a56a]/10 blur-3xl" />
      <div className="absolute -bottom-10 left-1/3 h-32 w-32 rounded-full bg-[#8d6738]/20 blur-2xl" />

      <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold tracking-wider text-[#ffdca3] backdrop-blur-md border border-white/20 shadow-inner md:h-20 md:w-20 md:text-2xl">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-4xl">
              Welcome back, <span className="text-[#ffdca3]">{workerName}</span>! 👋
            </h1>
            <p className="mt-1 text-sm text-gray-300 md:text-base">
              Great to see you! Check your schedule and active jobs for today.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-md border border-white/10 shadow-sm md:text-sm">
          <Calendar size={16} className="text-[#ffdca3]" />
          <span>{today}</span>
        </div>
      </div>
    </div>
  );
}
