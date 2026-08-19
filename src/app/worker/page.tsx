"use client";

import { useState } from "react";
import axios from "axios";
import {
  TrendingUp,
  AlertCircle,
  Power,
  ChevronRight,
  IndianRupee,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

import DashboardHeader from "@/components/worker/dashboard/DashboardHeader";
import StatsGrid from "@/components/worker/dashboard/StatsGrid";
import CurrentJobCard from "@/components/worker/dashboard/CurrentJobCard";
import RecentJobs from "@/components/worker/dashboard/RecentJobs";
import QuickActions from "@/components/worker/dashboard/QuickActions";
import DashboardSkeleton from "@/components/worker/dashboard/DashboardSkeleton";

import { useWorkerDashboard } from "@/hooks/useWorkerDashboard";
import { useWorkerProfile } from "@/hooks/useWorkerProfile";
import { useWorkerEarnings } from "@/hooks/useWorkerEarnings";

export default function WorkerDashboardPage() {
  const {
    dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    refresh: refreshDashboard,
  } = useWorkerDashboard();

  const {
    profile,
    loading: profileLoading,
    error: profileError,
    refresh: refreshProfile,
  } = useWorkerProfile();

  const {
    earnings,
    loading: earningsLoading,
    error: earningsError,
    refresh: refreshEarnings,
  } = useWorkerEarnings();

  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  const loading = dashboardLoading || profileLoading || earningsLoading;
  const error = dashboardError || profileError || earningsError;

  async function handleToggleAvailability() {
    if (!profile) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setUpdatingAvailability(true);
      await axios.patch(
        "/api/workers/availability",
        { isAvailable: !profile.isAvailable },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await refreshProfile();
      await refreshDashboard();
    } catch (err) {
      console.error("Failed to update availability:", err);
    } finally {
      setUpdatingAvailability(false);
    }
  }

  async function handleRefreshAll() {
    await Promise.all([
      refreshDashboard(),
      refreshProfile(),
      refreshEarnings(),
    ]);
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600 border border-rose-100 mb-4">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Failed to load Dashboard</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          {error || "An unexpected error occurred while loading your dashboard stats."}
        </p>
        <button
          onClick={handleRefreshAll}
          className="mt-6 flex items-center gap-2 rounded-xl bg-[#c8a56a] hover:bg-[#b08e54] text-white px-5 py-3 font-semibold transition"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  if (!dashboardData || !profile) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-6">
        <h2 className="text-xl font-bold text-gray-900">Profile Configuration Required</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          Please complete your profile configuration to access the partner dashboard.
        </p>
        <Link
          href="/worker/profile"
          className="mt-6 rounded-xl bg-[#c8a56a] hover:bg-[#b08e54] text-white px-5 py-3 font-semibold transition"
        >
          Go to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Upper header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-xs font-bold uppercase tracking-widest text-[#a07840]">
            SkillLink Partner Portal
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time status updates and incoming matches.
          </p>
        </div>

        <button
          onClick={handleRefreshAll}
          className="self-start flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
        >
          <RefreshCw size={14} className="text-gray-500" />
          Refresh Stats
        </button>
      </div>

      <DashboardHeader workerName={dashboardData.workerName} />

      {/* Main Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Dashboard metrics and activities */}
        <div className="lg:col-span-2 space-y-8">
          <StatsGrid stats={dashboardData.stats} />

          <QuickActions />

          <RecentJobs jobs={dashboardData.recentJobs} />
        </div>

        {/* Right Column: Sidebar statuses */}
        <div className="space-y-8">
          {/* Real-time Status Card */}
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <h2 className="text-lg font-bold text-gray-900">Work Status</h2>
            <p className="text-xs text-gray-400 mt-0.5 mb-6">Receive job assignments</p>

            <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300 ${
                    profile.isAvailable
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                  }`}
                >
                  <Power size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    {profile.isAvailable ? "You are Online" : "You are Offline"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {profile.isAvailable
                      ? "Ready for match requests"
                      : "Matches are paused"}
                  </p>
                </div>
              </div>

              {/* Styled custom toggle switch */}
              <button
                disabled={updatingAvailability}
                onClick={handleToggleAvailability}
                className={`relative inline-flex h-6.5 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  profile.isAvailable ? "bg-emerald-500 animate-pulse" : "bg-gray-200"
                } ${updatingAvailability ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                    profile.isAvailable ? "translate-x-5.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {profile.isAvailable ? (
              <div className="mt-4 rounded-xl bg-emerald-50/50 border border-emerald-100/50 p-3.5 text-xs text-emerald-700">
                ⚡ Keep the page active to receive instant push alerts for job requests near your current location.
              </div>
            ) : (
              <div className="mt-4 rounded-xl bg-amber-50/50 border border-amber-100/50 p-3.5 text-xs text-amber-700">
                ⚠️ You won't receive any customer match requests while offline. Click the switch above to go back online.
              </div>
            )}
          </section>

          {/* Current Working Active Job card */}
          <CurrentJobCard job={dashboardData.activeJob} />

          {/* Mini Earnings Summary card */}
          {earnings && (
            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Today's Payout</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Earnings tracking logs</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <TrendingUp size={20} />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Today</span>
                  <div className="flex items-baseline text-3xl font-extrabold text-gray-900 mt-1">
                    <IndianRupee size={22} className="self-center text-emerald-600" />
                    <span>{earnings.todayEarnings}</span>
                  </div>
                </div>

                {/* Progress bar mock matching standard provider target goals */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-500">Daily Target Progress</span>
                    <span className="text-gray-800">
                      {Math.min(100, Math.round((earnings.todayEarnings / 2000) * 100))}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#c8a56a] transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (earnings.todayEarnings / 2000) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Daily payout target goal: ₹2,000. Keep working to hit bonus targets!
                  </p>
                </div>
              </div>

              <Link
                href="/worker/earnings"
                className="mt-6 flex items-center justify-between rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 p-3 text-xs font-bold text-gray-700 transition"
              >
                <span>View Earnings Details</span>
                <ChevronRight size={16} />
              </Link>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
