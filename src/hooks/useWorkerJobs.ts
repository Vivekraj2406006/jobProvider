"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { WorkerJob } from "@/types/workerJob";

export function useWorkerJobs() {
  const [jobs, setJobs] = useState<WorkerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const { data } = await axios.get("/api/workers/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(data.jobs);
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? "Failed to load jobs.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return {
    jobs,
    loading,
    error,
    refresh: loadJobs,
  };
}
