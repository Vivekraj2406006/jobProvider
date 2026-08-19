"use client";

import { Wallet, ArrowUpRight, IndianRupee, CheckCircle2 } from "lucide-react";

interface EarningsJob {
  id: string;
  description: string;
  budget: number;
  updatedAt: string;
}

interface Props {
  jobs: EarningsJob[];
}

export default function RecentTransactions({ jobs }: Props) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Payout Statement</h2>
        <p className="text-xs text-gray-400 mt-0.5">Historical ledger of settled service bookings</p>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 border border-gray-150 mb-3">
            <Wallet size={22} />
          </div>
          <p className="text-sm font-semibold text-gray-500">No transactions recorded</p>
          <p className="text-xs text-gray-400 mt-0.5">Earnings will post automatically upon job completion.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {jobs.map((job) => {
            const formattedDate = new Date(job.updatedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={job.id}
                className="group flex items-center justify-between py-4 first:pt-0 last:pb-0 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:scale-105 transition-transform duration-300">
                    <ArrowUpRight size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-800">
                      {job.description || "Service Completed"}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div className="flex items-center justify-end text-sm font-extrabold text-emerald-600">
                    <span>+ ₹</span>
                    <span>{job.budget}</span>
                  </div>
                  <span className="hidden xs:inline-flex items-center gap-1 rounded-full bg-emerald-50/50 border border-emerald-100/50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                    <CheckCircle2 size={10} className="text-emerald-600" />
                    Settled
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
