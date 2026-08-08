"use client";
import { JobAction } from "@/types/jobAction";
import JobsList from "@/components/worker/jobs/JobsList";
import LoadingJobs from "@/components/worker/jobs/LoadingJobs";

import { useWorkerJobs } from "@/hooks/useWorkerJobs";
import { useWorkerJobActions } from "@/hooks/useWorkerJobActions";

export default function WorkerJobsPage() {
  const { jobs, loading, error, refresh } = useWorkerJobs();

  const { performAction } = useWorkerJobActions();

  async function handleAction(jobId: string, action: JobAction) {
    if (action === "view") return;

    await performAction(jobId, action);

    await refresh();
  }

  if (loading) {
    return <LoadingJobs />;
  }

  if (error) {
    return <div className="rounded-xl bg-red-50 p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Assigned Jobs</h1>

        <p className="text-gray-500">Manage all your assigned jobs.</p>
      </div>

      <JobsList jobs={jobs} onAction={handleAction} />
    </div>
  );
}
