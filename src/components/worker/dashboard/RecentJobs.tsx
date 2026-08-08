import Link from "next/link";
import { ArrowRight, CheckCircle2, IndianRupee, Wrench } from "lucide-react";

import { RecentJob } from "@/types/worker";

interface RecentJobsProps {
  jobs: RecentJob[];
}

export default function RecentJobs({ jobs }: RecentJobsProps) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Recent Jobs</h2>

        <Link
          href="/worker/jobs"
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No recent jobs found.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 p-4 transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-100 p-3">
                  <Wrench className="text-blue-600" size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">{job.service}</h3>

                  <div className="mt-1 flex items-center gap-2">
                    <CheckCircle2
                      className={
                        job.status === "COMPLETED"
                          ? "text-green-600"
                          : "text-red-500"
                      }
                      size={16}
                    />

                    <span className="text-sm text-gray-500">
                      {job.status.replaceAll("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end font-semibold">
                  <IndianRupee size={16} className="text-green-600" />

                  {job.amount}
                </div>

                <p className="mt-1 text-sm text-gray-500">{job.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
