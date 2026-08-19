import JobsList from "@/components/CustomerDashboard/JobsList";
import { ClipboardList, Sparkles } from "lucide-react";

export default function CustomerJobsPage() {
  return (
    <div className="min-h-screen bg-[#f8f5f0] px-4 py-6 sm:px-6 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#c87528]">
              <Sparkles size={14} />
              Your service activity
            </div>
            <h1 className="font-[Fraunces] text-4xl font-semibold tracking-tight text-[#1b2a4a] sm:text-5xl">
              My jobs
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Follow your bookings from request to completion, all in one place.
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-semibold text-[#1b2a4a] shadow-sm sm:flex">
            <ClipboardList size={18} className="text-[#c87528]" />
            Service history
          </div>
        </div>
        <JobsList />
      </div>
    </div>
  );
}
