"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Job {
  id: string;
  description: string;
  budget: number;
  status: string;
  createdAt: string;

  latitude: number | null;
  longitude: number | null;

  state: string | null;
  city: string | null;
  area: string | null;
  pincode: string | null;

  service?: {
    name: string;
    price: number;
  };

  customer?: {
    id: string;
    name: string;
    email: string;
  };

  worker?: {
    id?: string;
    rating?: number;
    experience?: number;

    user?: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params?.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!jobId) return;

  const fetchJob = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setJob(data.job);
      }
    } catch (error) {
      console.error("Error fetching job:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load immediately
  fetchJob();

  // Refresh every 5 seconds
  const interval = setInterval(fetchJob, 5000);

  // Cleanup when leaving the page
  return () => {
    clearInterval(interval);
  };
}, [jobId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg font-medium">
          Loading Job Details...
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-xl bg-white p-8 shadow">
          Job not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-8 shadow">
          <h1 className="mb-8 text-3xl font-bold">
            {job.service?.name || "Service"}
          </h1>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border p-5">
              <h2 className="mb-2 font-semibold">Status</h2>
              <p>{job.status}</p>
            </div>

            <div className="rounded-xl border p-5">
              <h2 className="mb-2 font-semibold">Budget</h2>
              <p className="text-lg font-bold text-green-600">
                ₹{job.budget}
              </p>
            </div>

            <div className="rounded-xl border p-5 md:col-span-2">
              <h2 className="mb-2 font-semibold">Description</h2>
              <p>{job.description}</p>
            </div>

            <div className="rounded-xl border p-5">
              <h2 className="mb-2 font-semibold">Customer</h2>
              <p>{job.customer?.name || "N/A"}</p>
              <p className="text-sm text-gray-500">
                {job.customer?.email || "N/A"}
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <h2 className="mb-2 font-semibold">Assigned Worker</h2>

              {job.worker?.user ? (
                <>
                  <p>{job.worker.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {job.worker.user.email}
                  </p>
                </>
              ) : (
                <p className="text-gray-500">
                  No worker assigned yet
                </p>
              )}
            </div>

            <div className="rounded-xl border p-5 md:col-span-2">
              <h2 className="mb-2 font-semibold">Created At</h2>
              <p>
                {new Date(job.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
