"use client";

import {
  Calendar,
  CalendarDays,
  BriefcaseBusiness,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

import EarningsCard from "./EarningsCard";

interface Props {
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  totalEarnings: number;
  totalJobs: number;
  averagePerJob: number;
}

export default function EarningsStats({
  todayEarnings,
  weeklyEarnings,
  monthlyEarnings,
  totalEarnings,
  totalJobs,
  averagePerJob,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <EarningsCard
        title="Today's Payout"
        value={`₹ ${todayEarnings}`}
        icon={Calendar}
        iconColor="bg-emerald-500 border border-emerald-100"
        cardHoverAccent="emerald-500/20"
      />

      <EarningsCard
        title="This Week"
        value={`₹ ${weeklyEarnings}`}
        icon={CalendarDays}
        iconColor="bg-blue-500 border border-blue-100"
        cardHoverAccent="blue-500/20"
      />

      <EarningsCard
        title="This Month"
        value={`₹ ${monthlyEarnings}`}
        icon={IndianRupee}
        iconColor="bg-indigo-500 border border-indigo-100"
        cardHoverAccent="indigo-500/20"
      />

      <EarningsCard
        title="Total Revenue"
        value={`₹ ${totalEarnings}`}
        icon={TrendingUp}
        iconColor="bg-amber-500 border border-amber-100"
        cardHoverAccent="amber-500/20"
      />

      <EarningsCard
        title="Completed Payouts"
        value={totalJobs}
        icon={BriefcaseBusiness}
        iconColor="bg-cyan-500 border border-cyan-100"
        cardHoverAccent="cyan-500/20"
      />

      <EarningsCard
        title="Average / Assignment"
        value={`₹ ${Math.round(averagePerJob)}`}
        icon={IndianRupee}
        iconColor="bg-pink-500 border border-pink-100"
        cardHoverAccent="pink-500/20"
      />
    </div>
  );
}
