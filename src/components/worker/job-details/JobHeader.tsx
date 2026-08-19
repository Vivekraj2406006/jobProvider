"use client";

import { IndianRupee } from "lucide-react";
import JobStatusBadge from "@/components/worker/jobs/JobStatusBadge";

interface JobHeaderProps {
  service: {
    name: string;
    category: string | null;
  };
  status: string;
  budget: number;
}

export default function JobHeader({ service, status, budget }: JobHeaderProps) {
  return (
    <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl tracking-tight">
            {service.name}
          </h1>
          <p className="text-xs text-gray-400 mt-1">{service.category || "General Service"}</p>
        </div>

        <div className="flex flex-row items-center justify-between gap-4 md:flex-col md:items-end">
          <JobStatusBadge status={status as any} />

          <div className="flex items-center gap-1.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/50 px-4 py-2 text-emerald-800">
            <IndianRupee size={16} className="text-emerald-600" />
            <span className="text-base font-extrabold">₹ {budget}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
