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

export default function StatsGrid({
  stats,
}: StatsGridProps) {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Assigned Jobs"
        value={stats.assignedJobs}
        icon={BriefcaseBusiness}
        iconBgColor="bg-blue-600"
      />

      <StatsCard
        title="Active Jobs"
        value={stats.activeJobs}
        icon={Truck}
        iconBgColor="bg-orange-500"
      />

      <StatsCard
        title="Completed Jobs"
        value={stats.completedJobs}
        icon={CheckCircle2}
        iconBgColor="bg-green-600"
      />

      <StatsCard
        title="Rating"
        value={`${stats.rating} ⭐`}
        icon={Star}
        iconBgColor="bg-yellow-500"
      />
    </section>
  );
}
