"use client";

import Link from "next/link";
import { User, MapPin, IndianRupee, ArrowRight } from "lucide-react";
import { WorkerJob } from "@/types/workerJob";
import JobStatusBadge from "./JobStatusBadge";
import JobActions from "./JobActions";

interface JobCardProps {
  job: WorkerJob;
  onAction?: (
    jobId: string,
    action:
      | "accept"
      | "reject"
      | "startJourney"
      | "markArrived"
      | "startWork"
      | "complete"
      | "view",
  ) => void;
}

export default function JobCard({ job, onAction }: JobCardProps) {
  const customerInitials = job.customer.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "C";

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.06)]">
      {/* Light gradient highlight on card hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-50 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#c8a56a] transition-colors">
              {job.service.name}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{job.service.category || "General Service"}</p>
          </div>
          <JobStatusBadge status={job.status} />
        </div>

        {/* Body Info Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {/* Customer */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 font-bold text-sm">
              {customerInitials}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Customer</span>
              <p className="truncate text-sm font-semibold text-gray-800">{job.customer.name}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
              <MapPin size={18} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Location</span>
              <p className="truncate text-sm font-semibold text-gray-800">
                {job.address.area ? `${job.address.area}, ` : ""}{job.address.city || "-"}
              </p>
            </div>
          </div>

          {/* Payout */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <IndianRupee size={18} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Budget Payout</span>
              <p className="text-sm font-extrabold text-emerald-600">₹ {job.budget}</p>
            </div>
          </div>
        </div>

        {/* Details & Action Panel */}
        <div className="mt-6 flex flex-col gap-4 border-t border-gray-50 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <JobActions
            status={job.status}
            onAction={(action) => onAction?.(job.id, action)}
          />

          <Link
            href={`/worker/jobs/${job.id}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition duration-300"
          >
            <span>View Details</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
