import { CheckCircle, Circle } from "lucide-react";
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
    label: "Accepted",
  },
  {
    status: "ON_THE_WAY",
    label: "On The Way",
  },
  {
    status: "ARRIVED",
    label: "Arrived",
  },
  {
    status: "IN_PROGRESS",
    label: "In Progress",
  },
  {
    status: "COMPLETED",
    label: "Completed",
  },
] as const;

export default function JobTimeline({ status }: Props) {
  const currentIndex = steps.findIndex((step) => step.status === status);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Job Progress</h2>

      <div className="space-y-5">
        {steps.map((step, index) => {
          const completed = index <= currentIndex;

          return (
            <div key={step.status} className="flex items-center gap-4">
              {completed ? (
                <CheckCircle className="text-green-600" size={22} />
              ) : (
                <Circle className="text-gray-400" size={22} />
              )}

              <span
                className={
                  completed ? "font-semibold text-gray-900" : "text-gray-500"
                }
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
