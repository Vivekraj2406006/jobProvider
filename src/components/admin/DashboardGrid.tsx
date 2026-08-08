import {
  Users,
  BriefcaseBusiness,
  User,
  ClipboardList,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import { AdminDashboard } from "@/types/admin";

import StatCard from "./StatCard";

interface Props {
  dashboard: AdminDashboard;
}

export default function DashboardGrid({
  dashboard,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Users"
        value={dashboard.totalUsers}
        icon={Users}
        color="bg-blue-600"
      />

      <StatCard
        title="Workers"
        value={dashboard.totalWorkers}
        icon={BriefcaseBusiness}
        color="bg-green-600"
      />

      <StatCard
        title="Customers"
        value={dashboard.totalCustomers}
        icon={User}
        color="bg-purple-600"
      />

      <StatCard
        title="Jobs"
        value={dashboard.totalJobs}
        icon={ClipboardList}
        color="bg-orange-600"
      />

      <StatCard
        title="Completed"
        value={dashboard.completedJobs}
        icon={CheckCircle2}
        color="bg-emerald-600"
      />

      <StatCard
        title="Pending"
        value={dashboard.pendingJobs}
        icon={Clock3}
        color="bg-yellow-600"
      />

      <StatCard
        title="Cancelled"
        value={dashboard.cancelledJobs}
        icon={XCircle}
        color="bg-red-600"
      />
    </div>
  );
}
