"use client";

import { DashboardGrid } from "@/components/admin";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

export default function AdminDashboardPage() {
  const {
    dashboard,
    loading,
    error,
  } = useAdminDashboard();

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-600">
        {error}
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-8">
        Dashboard not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome to the SkillLink Admin Panel.
        </p>
      </div>

      <DashboardGrid dashboard={dashboard} />
    </div>
  );
}
