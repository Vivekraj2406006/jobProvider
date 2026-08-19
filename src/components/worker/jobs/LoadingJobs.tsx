"use client";

export default function LoadingJobs() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-3xl border border-gray-100 bg-white p-6"
        >
          {/* Header Shimmer */}
          <div className="flex items-start justify-between border-b border-gray-50 pb-4">
            <div className="space-y-2">
              <div className="h-5 w-48 rounded bg-gray-200" />
              <div className="h-3.5 w-24 rounded bg-gray-200" />
            </div>
            <div className="h-6 w-20 rounded-full bg-gray-200" />
          </div>

          {/* Grid Shimmer */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-gray-200" />
                <div className="w-full space-y-1.5">
                  <div className="h-3 w-10 rounded bg-gray-200" />
                  <div className="h-4 w-24 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>

          {/* Footer Shimmer */}
          <div className="mt-6 flex flex-col gap-4 border-t border-gray-50 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-10 w-36 rounded-xl bg-gray-200" />
            <div className="h-10 w-28 rounded-xl bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
