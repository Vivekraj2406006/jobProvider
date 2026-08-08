"use client";

import JobActions from "@/components/worker/jobs/JobActions";
import { JobStatus } from "@prisma/client";
import { JobAction } from "@/types/jobAction";

interface ActionFooterProps {
  jobId: string;
  status: JobStatus;
  onAction: (jobId: string, action: JobAction) => Promise<void>;
}

export default function ActionFooter({
  jobId,
  status,
  onAction,
}: ActionFooterProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Job Actions</h2>

      <JobActions
        status={status}
        onAction={(action) => onAction(jobId, action)}
      />
    </div>
  );
}
