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
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>

          <p className="mt-2 text-gray-500">{service.category}</p>
        </div>

        <div className="flex flex-col items-end gap-4">
          <JobStatusBadge status={status as any} />

          <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2">
            <IndianRupee className="text-green-600" size={20} />

            <span className="text-lg font-bold text-green-700">₹ {budget}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
