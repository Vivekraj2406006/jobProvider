"use client";

import Link from "next/link";
import {
  User,
  BriefcaseBusiness,
  MapPin,
  IndianRupee,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { ActiveJob } from "@/types/worker";

interface CurrentJobCardProps {
  job: ActiveJob | null;
}

export default function CurrentJobCard({ job }: CurrentJobCardProps) {
  if (!job) {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        {/* Subtle gold flare background */}
        <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-[#c8a56a]/5 blur-xl" />

        <h2 className="text-lg font-bold text-gray-900">Current Active Job</h2>

        <div className="my-6 flex flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 mb-4 animate-bounce">
            <Sparkles size={28} />
          </div>
          <h3 className="font-semibold text-gray-800">You're all caught up!</h3>
          <p className="mt-1 max-w-xs text-xs text-gray-500">
            No active jobs in progress. Set your status to Available to receive new assignments.
          </p>
        </div>

        <Link
          href="/worker/jobs"
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-50 border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
        >
          Browse Open Jobs
          <ArrowRight size={16} />
        </Link>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      {/* Glow highlight */}
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-amber-500 to-[#c8a56a]" />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Current Active Job</h2>
          <p className="text-xs text-gray-400 mt-0.5">Ongoing assignment</p>
        </div>

        <span className="relative flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
          </span>
          {job.status.replaceAll("_", " ")}
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        <div className="flex items-center gap-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <User size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Customer</p>
            <p className="truncate text-sm font-semibold text-gray-800">{job.customer}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <BriefcaseBusiness size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Service Required</p>
            <p className="truncate text-sm font-semibold text-gray-800">{job.service}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
            <MapPin size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Location</p>
            <p className="truncate text-sm font-semibold text-gray-800">{job.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <IndianRupee size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Payout Budget</p>
            <p className="text-sm font-bold text-emerald-600">₹ {job.budget}</p>
          </div>
        </div>
      </div>

      <Link
        href={`/worker/jobs/${job.id}`}
        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#c8a56a] hover:bg-[#b08e54] text-white px-4 py-3 text-sm font-bold shadow-md shadow-amber-500/10 transition duration-300"
      >
        Manage Job Progress
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </section>
  );
}
