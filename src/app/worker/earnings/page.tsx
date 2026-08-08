"use client";

import {
  EarningsStats,
  RecentTransactions,
} from "@/components/worker/earnings";

import { useWorkerEarnings } from "@/hooks/useWorkerEarnings";

export default function EarningsPage() {
  const { earnings, loading, error } = useWorkerEarnings();

  if (loading) {
    return <div className="p-8">Loading earnings...</div>;
  }

  if (error) {
    return <div className="rounded-xl bg-red-50 p-6 text-red-600">{error}</div>;
  }

  if (!earnings) {
    return <div className="p-8 text-gray-500">No earnings found.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Earnings</h1>

        <p className="mt-2 text-gray-600">
          Track your income and completed jobs.
        </p>
      </div>

      <EarningsStats
        todayEarnings={earnings.todayEarnings}
        weeklyEarnings={earnings.weeklyEarnings}
        monthlyEarnings={earnings.monthlyEarnings}
        totalEarnings={earnings.totalEarnings}
        totalJobs={earnings.totalJobs}
        averagePerJob={earnings.averagePerJob}
      />

      <RecentTransactions jobs={earnings.jobs} />
    </div>
  );
}
