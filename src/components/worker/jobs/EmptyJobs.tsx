import { BriefcaseBusiness } from "lucide-react";

export default function EmptyJobs() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
      <BriefcaseBusiness
        size={48}
        className="mx-auto text-gray-400"
      />

      <h2 className="mt-4 text-xl font-semibold">
        No Assigned Jobs
      </h2>

      <p className="mt-2 text-gray-500">
        New jobs assigned to you will appear here.
      </p>
    </div>
  );
}
