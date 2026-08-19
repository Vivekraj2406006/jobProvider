"use client";

import { JOB_STATUS, JobAction } from "@/lib/worker/jobStatus";
import { JobStatus } from "@prisma/client";

interface JobActionsProps {
  status: JobStatus;
  onAction?: (action: JobAction["key"]) => void;
}

export default function JobActions({ status, onAction }: JobActionsProps) {
  const config = JOB_STATUS[status];

  if (!config || !config.actions || config.actions.length === 0) {
    return null;
  }

  function getButtonStyle(action: JobAction) {
    switch (action.variant) {
      case "success":
        return "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/10";

      case "danger":
        return "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-500/10";

      case "primary":
        return "bg-[#c8a56a] hover:bg-[#b08e54] text-white shadow-sm shadow-amber-500/10";

      case "secondary":
        return "bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700";

      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {config.actions.map((action) => (
        <button
          key={action.key}
          type="button"
          onClick={() => onAction?.(action.key)}
          className={`flex-1 sm:flex-initial rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 ${getButtonStyle(
            action,
          )}`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
