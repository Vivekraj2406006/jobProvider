"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { WorkerProfile } from "@/types/workerProfile";

export function useWorkerProfile() {
  const [profile, setProfile] = useState<WorkerProfile | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get("/api/workers/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setProfile(data.profile);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? "Failed to load profile.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    error,
    refresh: loadProfile,
  };
}
