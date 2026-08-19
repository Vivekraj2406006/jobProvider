"use client";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Welcome Banner Skeleton */}
      <div className="h-40 w-full rounded-3xl bg-gray-200" />

      {/* Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid Skeleton */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-gray-200" />
            ))}
          </div>

          {/* Quick Actions Skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-36 rounded bg-gray-200" />
            <div className="grid gap-4 sm:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-gray-200" />
              ))}
            </div>
          </div>

          {/* Recent Jobs Skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-32 rounded bg-gray-200" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-gray-200" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          {/* Availability Card Skeleton */}
          <div className="h-32 rounded-2xl bg-gray-200" />

          {/* Current Job Skeleton */}
          <div className="h-64 rounded-2xl bg-gray-200" />

          {/* Earnings Skeleton */}
          <div className="h-48 rounded-2xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
