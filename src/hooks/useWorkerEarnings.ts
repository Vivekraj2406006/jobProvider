"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

interface EarningsJob {
  id: string;
  description: string;
  budget: number;
  updatedAt: string;
}

interface EarningsData {
  totalEarnings: number;
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  totalJobs: number;
  averagePerJob: number;
  jobs: EarningsJob[];
}

export function useWorkerEarnings() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEarnings = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get("/api/workers/earnings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setEarnings(data.earnings);
      } else {
        setError(data.message || "Failed to load earnings.");
      }
    } catch (error) {
      console.error("Failed to load earnings:", error);

      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? "Failed to load earnings.");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEarnings();
  }, [loadEarnings]);

  return {
    earnings,
    loading,
    error,
    refresh: loadEarnings,
  };
}
