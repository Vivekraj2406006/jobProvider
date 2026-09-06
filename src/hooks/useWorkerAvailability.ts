"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getWorkerAvailability,
  updateWorkerAvailability,
  type WorkerAvailabilityEntry,
} from "@/lib/api/workerAvailabilityApi";

interface UseWorkerAvailabilityResult {
  availability: WorkerAvailabilityEntry[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  save: (
    availability: WorkerAvailabilityEntry[]
  ) => Promise<WorkerAvailabilityEntry[]>;
}

export function useWorkerAvailability(): UseWorkerAvailabilityResult {
  const [availability, setAvailability] = useState<
    WorkerAvailabilityEntry[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getWorkerAvailability();

      setAvailability(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load worker availability."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(
    async (nextAvailability: WorkerAvailabilityEntry[]) => {
      try {
        setSaving(true);
        setError(null);

        const saved = await updateWorkerAvailability(nextAvailability);

        setAvailability(saved);

        return saved;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to save worker availability."
        );

        throw err;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    availability,
    loading,
    saving,
    error,
    refresh,
    save,
  };
}
