"use client";

import { CheckCircle2, XCircle, Power } from "lucide-react";

interface Props {
  available: boolean;
}

export default function AvailabilityCard({ available }: Props) {
  return (
    <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
      <h2 className="text-lg font-bold text-gray-900">Work Availability</h2>
      <p className="text-xs text-gray-400 mt-0.5 mb-6">Match status with customers</p>

      <div
        className={`flex items-start gap-4 rounded-2xl border p-4 transition-all duration-300 ${
          available
            ? "bg-emerald-50/50 border-emerald-100/80 text-emerald-800 shadow-sm shadow-emerald-500/5"
            : "bg-rose-50/50 border-rose-100/80 text-rose-800 shadow-sm shadow-rose-500/5"
        }`}
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
            available
              ? "bg-emerald-100 text-emerald-600 border-emerald-250"
              : "bg-rose-100 text-rose-600 border-rose-250"
          }`}
        >
          <Power size={20} className={available ? "animate-pulse" : ""} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm uppercase tracking-wider">
              {available ? "Online" : "Offline"}
            </span>
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${available ? "animate-ping bg-emerald-400" : "bg-rose-400"}`}></span>
              <span className={`relative inline-flex h-2 w-2 rounded-full ${available ? "bg-emerald-500" : "bg-rose-500"}`}></span>
            </span>
          </div>

          <p className={`mt-1 text-xs leading-relaxed ${available ? "text-emerald-600/90" : "text-rose-600/90"}`}>
            {available
              ? "You are currently online and matching with service bookings in your area. Matches will trigger push alert notifications."
              : "You are currently offline. You will not receive any match updates or job alerts. Go online in your main dashboard to resume."}
          </p>
        </div>
      </div>
    </div>
  );
}
