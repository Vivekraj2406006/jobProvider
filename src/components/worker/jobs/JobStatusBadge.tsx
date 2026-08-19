"use client";

import { JobStatus } from "@prisma/client";
import { JOB_STATUS } from "@/lib/worker/jobStatus";

interface JobStatusBadgeProps {
  status: JobStatus;
}

export default function JobStatusBadge({ status }: JobStatusBadgeProps) {
  const config = JOB_STATUS[status] || {
    label: status.replaceAll("_", " "),
    bgColor: "bg-gray-50",
    textColor: "text-gray-600",
  };

  // Modern soft color style maps matching the design language
  function getStyleOverride(statusKey: JobStatus) {
    switch (statusKey) {
      case "PENDING_ACCEPTANCE":
        return {
          bg: "bg-amber-50/80 border-amber-100",
          text: "text-amber-700",
          dot: "bg-amber-500 animate-pulse",
        };
      case "ACCEPTED":
        return {
          bg: "bg-blue-50/80 border-blue-100",
          text: "text-blue-700",
          dot: "bg-blue-500",
        };
      case "ON_THE_WAY":
        return {
          bg: "bg-indigo-50/80 border-indigo-100",
          text: "text-indigo-700",
          dot: "bg-indigo-500",
        };
      case "ARRIVED":
        return {
          bg: "bg-purple-50/80 border-purple-100",
          text: "text-purple-700",
          dot: "bg-purple-500",
        };
      case "IN_PROGRESS":
        return {
          bg: "bg-orange-50/80 border-orange-100",
          text: "text-orange-700",
          dot: "bg-orange-500 animate-ping",
        };
      case "COMPLETED":
        return {
          bg: "bg-emerald-50/80 border-emerald-100",
          text: "text-emerald-700",
          dot: "bg-emerald-500",
        };
      case "CANCELLED":
      case "REJECTED":
        return {
          bg: "bg-rose-50/80 border-rose-100",
          text: "text-rose-700",
          dot: "bg-rose-500",
        };
      default:
        return {
          bg: "bg-gray-50/80 border-gray-100",
          text: "text-gray-600",
          dot: "bg-gray-400",
        };
    }
  }

  const styles = getStyleOverride(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold tracking-wide ${styles.bg} ${styles.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}
