"use client";

import axios from "axios";
import { JobAction } from "@/types/jobAction";

export function useWorkerJobActions() {
  async function performAction(jobId: string, action: JobAction) {
    if (action === "view") {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const { data } = await axios.patch(
      `/api/workers/jobs/${jobId}`,
      {
        action,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  }

  return {
    performAction,
  };
}
