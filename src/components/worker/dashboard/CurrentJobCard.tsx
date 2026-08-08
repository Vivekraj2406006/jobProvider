import Link from "next/link";
import {
  User,
  BriefcaseBusiness,
  MapPin,
  IndianRupee,
  ArrowRight,
} from "lucide-react";

import { ActiveJob } from "@/types/worker";

interface CurrentJobCardProps {
  job: ActiveJob | null;
}

export default function CurrentJobCard({
  job,
}: CurrentJobCardProps) {
  if (!job) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Current Active Job
        </h2>

        <p className="mt-4 text-gray-500">
          No active job assigned.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Current Active Job
        </h2>

        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
          {job.status.replaceAll("_", " ")}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <User className="text-blue-600" size={20} />

          <div>
            <p className="text-sm text-gray-500">Customer</p>

            <p className="font-medium">{job.customer}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <BriefcaseBusiness className="text-blue-600" size={20} />

          <div>
            <p className="text-sm text-gray-500">Service</p>

            <p className="font-medium">{job.service}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="text-blue-600" size={20} />

          <div>
            <p className="text-sm text-gray-500">Location</p>

            <p className="font-medium">{job.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <IndianRupee className="text-green-600" size={20} />

          <div>
            <p className="text-sm text-gray-500">Budget</p>

            <p className="font-medium">₹{job.budget}</p>
          </div>
        </div>
      </div>

      <Link
        href={`/worker/jobs/${job.id}`}
        className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        View Details
        <ArrowRight size={18} />
      </Link>
    </section>
  );
}
