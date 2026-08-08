"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { WorkerJobDetails } from "@/types/workerJob";

export function useWorkerJobDetails(jobId: string) {
  const [job, setJob] = useState<WorkerJobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadJob = useCallback(async () => {
    if (!jobId) return;
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const { data } = await axios.get(`/api/workers/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Job Details Response:", data);

      setJob(data.job);
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? "Failed to load job.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }, [jobId]);

useEffect(() => {
  if (jobId) {
    loadJob();
  }
}, [jobId, loadJob]);

  return {
    job,
    loading,
    error,
    refresh: loadJob,
  };
}
