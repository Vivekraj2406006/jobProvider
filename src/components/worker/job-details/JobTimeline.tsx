"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { JobStatus } from "@prisma/client";

interface Props {
  status: JobStatus;
}

const steps = [
  {
    status: "PENDING_ACCEPTANCE",
    label: "Pending Acceptance",
  },
  {
    status: "ACCEPTED",
    label: "Accepted & Scheduled",
  },
  {
    status: "ON_THE_WAY",
    label: "On The Way to Location",
  },
  {
    status: "ARRIVED",
    label: "Arrived at Customer Base",
  },
  {
    status: "IN_PROGRESS",
    label: "Service In Progress",
  },
  {
    status: "COMPLETED",
    label: "Service Completed",
  },
] as const;

export default function JobTimeline({ status }: Props) {
  const currentIndex = steps.findIndex((step) => step.status === status);

  return (
    <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Job Progress</h2>
        <p className="text-xs text-gray-400 mt-0.5">Real-time coordinator timeline status</p>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={step.status} className="relative flex items-center gap-4">
              {/* Timeline dot locator node */}
              <div className="absolute -left-6.5 flex items-center justify-center bg-white">
                {isCompleted ? (
                  <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                    <CheckCircle2 size={12} className="fill-emerald-50 text-emerald-600" />
                  </span>
                ) : isActive ? (
                  <span className="relative flex h-5.5 w-5.5 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-200 shadow-sm">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-30"></span>
                    <Clock size={12} className="relative text-amber-500" />
                  </span>
                ) : (
                  <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-gray-50 text-gray-300 border border-gray-100">
                    <Circle size={10} className="fill-gray-50 text-gray-300" />
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <span
                  className={`text-sm font-bold leading-none ${
                    isActive
                      ? "text-[#c8a56a]"
                      : isCompleted
                      ? "text-gray-700"
                      : "text-gray-400 font-semibold"
                  }`}
                >
                  {step.label}
                </span>
                {isActive && (
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Current Status</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
