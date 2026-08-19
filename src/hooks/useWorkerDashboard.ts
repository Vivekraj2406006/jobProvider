"use client";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { WorkerDashboardData } from "@/types/worker";

export function useWorkerDashboard() {
  const [dashboardData, setDashboardData] = useState<WorkerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get("/api/workers/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setDashboardData(data.dashboard);
      } else {
        setError(data.message || "Failed to load dashboard.");
      }
    } catch (error) {
      console.error("Failed to load worker dashboard:", error);

      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? "Failed to load dashboard.");
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
    loadDashboard();
  }, [loadDashboard]);

  return {
    dashboardData,
    loading,
    error,
    refresh: loadDashboard,
  };
}
