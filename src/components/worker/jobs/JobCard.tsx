import Link from "next/link";
import { User, MapPin, IndianRupee } from "lucide-react";
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
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      {/* Header */}

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {job.service.name}
          </h2>

          <p className="text-sm text-gray-500">{job.service.category}</p>
        </div>

        <JobStatusBadge status={job.status} />
      </div>

      {/* Body */}

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3">
          <User size={18} className="text-blue-600" />

          <div>
            <p className="text-xs text-gray-500">Customer</p>

            <p className="font-medium">{job.customer.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin size={18} className="text-blue-600" />

          <div>
            <p className="text-xs text-gray-500">Location</p>

            <p className="font-medium">
              {job.address.area}, {job.address.city}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <IndianRupee size={18} className="text-green-600" />

          <div>
            <p className="text-xs text-gray-500">Budget</p>

            <p className="font-medium">₹ {job.budget}</p>
          </div>
        </div>
      </div>

      {/* Footer */}

      <div className="mt-8 flex flex-col gap-4">
        <JobActions
          status={job.status}
          onAction={(action) => onAction?.(job.id, action)}
        />

        <Link
          href={`/worker/jobs/${job.id}`}
          className="text-center text-sm font-semibold text-blue-600 hover:underline"
        >
          View Full Details →
        </Link>
      </div>
    </div>
  );
}
