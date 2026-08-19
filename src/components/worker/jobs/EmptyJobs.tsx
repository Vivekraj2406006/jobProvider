"use client";

import { Inbox, Sparkles } from "lucide-react";

export default function EmptyJobs() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
      {/* Decorative flair */}
      <div className="absolute right-10 top-10 h-16 w-16 rounded-full bg-[#c8a56a]/5 blur-lg" />

      <div className="relative flex flex-col items-center justify-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 mb-5">
          <Inbox size={32} />
          <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white border border-white">
            <Sparkles size={10} className="fill-white" />
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900">No Assigned Jobs</h3>
        <p className="mt-1.5 max-w-sm text-sm text-gray-500">
          Your workspace queue is currently empty. As soon as a customer books a matching service in your area, it will appear here.
        </p>

        <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-xs text-gray-500">
          💡 Make sure your availability toggle is set to <strong className="text-emerald-600">Online</strong> on your main dashboard to receive matches!
        </div>
      </div>
    </div>
  );
}
