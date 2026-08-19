"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, IndianRupee, Wrench, XCircle, Clock } from "lucide-react";
import { RecentJob } from "@/types/worker";

interface RecentJobsProps {
  jobs: RecentJob[];
}

export default function RecentJobs({ jobs }: RecentJobsProps) {
  function getStatusStyle(status: string) {
    switch (status) {
      case "COMPLETED":
        return {
          bg: "bg-emerald-50 border-emerald-100",
          text: "text-emerald-700",
          icon: <CheckCircle2 className="text-emerald-600" size={16} />,
        };
      case "CANCELLED":
      case "REJECTED":
        return {
          bg: "bg-rose-50 border-rose-100",
          text: "text-rose-700",
          icon: <XCircle className="text-rose-500" size={16} />,
        };
      default:
        return {
          bg: "bg-amber-50 border-amber-100",
          text: "text-amber-700",
          icon: <Clock className="text-amber-500" size={16} />,
        };
    }
  }

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Recent Job History</h2>
          <p className="text-xs text-gray-400 mt-0.5">Logs of your recent services</p>
        </div>

        <Link
          href="/worker/jobs"
          className="flex items-center gap-1 text-xs font-bold text-[#c8a56a] hover:text-[#b08e54] transition"
        >
          View All
          <ArrowRight size={14} />
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 border border-gray-200 mb-3">
            <Wrench size={22} />
          </div>
          <p className="text-sm font-semibold text-gray-500">No jobs completed yet</p>
          <p className="text-xs text-gray-400 mt-0.5">Your work history will show up here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const statusStyle = getStatusStyle(job.status);
            const formattedDate = new Date(job.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <Link
                key={job.id}
                href={`/worker/jobs/${job.id}`}
                className="group flex items-center justify-between rounded-2xl border border-gray-50 p-4 transition-all duration-300 hover:border-gray-200 hover:bg-gray-50/50 hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-600 border border-gray-100 group-hover:bg-[#c8a56a]/10 group-hover:text-[#c8a56a] group-hover:border-[#c8a56a]/20 transition-all duration-300">
                    <Wrench size={18} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-gray-900 group-hover:text-[#c8a56a] transition-colors">
                      {job.service}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.icon}
                        <span>{job.status.replaceAll("_", " ")}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end text-sm font-extrabold text-gray-900">
                    <IndianRupee size={12} className="text-emerald-600" />
                    <span>{job.amount}</span>
                  </div>
                  <p className="mt-0.5 text-[10px] font-bold text-gray-400">{formattedDate}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
