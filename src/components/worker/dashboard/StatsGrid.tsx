"use client";

import {
  BriefcaseBusiness,
  CheckCircle2,
  Star,
  Truck,
} from "lucide-react";

import StatsCard from "./StatsCard";
import { WorkerStats } from "@/types/worker";

interface StatsGridProps {
  stats: WorkerStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Assigned Jobs"
        value={stats.assignedJobs}
        icon={BriefcaseBusiness}
        iconBgColor="bg-blue-50 border border-blue-100"
        iconColor="text-blue-600"
        cardBorderHover="blue-500/20"
      />

      <StatsCard
        title="Active Jobs"
        value={stats.activeJobs}
        icon={Truck}
        iconBgColor="bg-amber-50 border border-amber-100"
        iconColor="text-amber-600"
        cardBorderHover="amber-500/20"
      />

      <StatsCard
        title="Completed Jobs"
        value={stats.completedJobs}
        icon={CheckCircle2}
        iconBgColor="bg-emerald-50 border border-emerald-100"
        iconColor="text-emerald-600"
        cardBorderHover="emerald-500/20"
      />

      <StatsCard
        title="Rating"
        value={stats.rating ? `${Number(stats.rating).toFixed(1)}` : "0.0"}
        icon={Star}
        iconBgColor="bg-yellow-50 border border-yellow-100"
        iconColor="text-yellow-500 fill-yellow-500"
        cardBorderHover="yellow-500/20"
      />
    </section>
  );
}
