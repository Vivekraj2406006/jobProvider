"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { WorkerJob } from "@/types/job";

import JobsList from "@/components/worker/jobs/JobsList";
import LoadingJobs from "@/components/worker/jobs/LoadingJobs";

import { useWorkerJobActions } from "@/hooks/useWorkerJobActions";

export default function WorkerJobsPage() {
  const [jobs, setJobs] = useState<WorkerJob[]>([]);
  const [loading, setLoading] = useState(true);

  const { performAction } = useWorkerJobActions();

  async function loadJobs() {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        "/api/workers/jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJobs(data.jobs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function handleAction(
    jobId: string,
    action:
      | "accept"
      | "reject"
      | "startJourney"
      | "markArrived"
      | "startWork"
      | "complete"
      | "view"
  ) {
    if (action === "view") return;

    await performAction(jobId, action);

    await loadJobs();
  }

  if (loading) {
    return <LoadingJobs />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          My Assigned Jobs
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your assigned jobs and update their progress.
        </p>
      </div>

      <JobsList
        jobs={jobs}
        onAction={handleAction}
      />
    </div>
  );
}
