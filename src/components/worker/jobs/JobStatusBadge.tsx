import { JobStatus } from "@prisma/client";
import { JOB_STATUS } from "@/lib/worker/jobStatus";

interface JobStatusBadgeProps {
  status: JobStatus;
}

export default function JobStatusBadge({
  status,
}: JobStatusBadgeProps) {
  const config = JOB_STATUS[status];

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${config.bgColor} ${config.textColor}`}
    >
      {config.label}
    </span>
  );
}
