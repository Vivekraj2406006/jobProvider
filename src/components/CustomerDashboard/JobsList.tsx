"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  description: string;
  status: string;
  createdAt: string;

  worker?: {
    user?: {
      name: string;
      email: string;
    };
  };

  service?: {
    name: string;
    price: number;
  };
}

export default function JobsList() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch("/api/jobs/my-jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openJobs = jobs.filter(
    (job) => job.status === "OPEN"
  );

  const pendingJobs = jobs.filter(
    (job) => job.status === "PENDING_ACCEPTANCE"
  );

  const acceptedJobs = jobs.filter(
    (job) => job.status === "ACCEPTED"
  );

  const activeJobs = jobs.filter(
    (job) =>
      job.status === "ON_THE_WAY" ||
      job.status === "ARRIVED" ||
      job.status === "IN_PROGRESS"
  );

  const completedJobs = jobs.filter(
    (job) => job.status === "COMPLETED"
  );

  const cancelledJobs = jobs.filter(
    (job) =>
      job.status === "CANCELLED" ||
      job.status === "REJECTED"
  );

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-lg font-semibold text-gray-500">
          Loading your jobs...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-4 md:grid-cols-6">
        <StatCard title="Open" count={openJobs.length} />
        <StatCard title="Pending" count={pendingJobs.length} />
        <StatCard title="Accepted" count={acceptedJobs.length} />
        <StatCard title="Active" count={activeJobs.length} />
        <StatCard title="Completed" count={completedJobs.length} />
        <StatCard title="Cancelled" count={cancelledJobs.length} />
      </div>

      <JobSection title="Open Jobs" jobs={openJobs} />
      <JobSection title="Pending Acceptance" jobs={pendingJobs} />
      <JobSection title="Accepted Jobs" jobs={acceptedJobs} />
      <JobSection title="Active Jobs" jobs={activeJobs} />
      <JobSection title="Completed Jobs" jobs={completedJobs} />
      <JobSection title="Cancelled Jobs" jobs={cancelledJobs} />
    </div>
  );
}

function StatCard({ title, count }: { title: string; count: number }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>

      <h2 className="mt-2 text-3xl font-bold">{count}</h2>
    </div>
  );
}

function JobSection({ title, jobs }: { title: string; jobs: Job[] }) {
  const router = useRouter();

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">
        {title} ({jobs.length})
      </h2>

      {jobs.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="text-5xl">📦</div>

          <h3 className="mt-4 text-lg font-semibold">No Jobs Found</h3>

          <p className="mt-2 text-gray-500">
            Your service requests will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold">
                    {job.service?.name ?? "Service"}
                  </h3>

                  <p className="mt-2 text-gray-600">{job.description}</p>

                  {job.service?.price && (
                    <p className="mt-3 font-semibold text-green-600">
                      ₹{job.service.price}
                    </p>
                  )}

                  <p className="mt-3 text-sm text-gray-500">
                    {new Date(job.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  <StatusBadge status={job.status} />

                  {job.worker?.user && (
                    <div className="text-sm">
                      <p className="font-medium">
                        Worker: {job.worker.user.name}
                      </p>

                      <p className="text-gray-500">{job.worker.user.email}</p>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      router.push(`/dashboard/customer/jobs/${job.id}`)
                    }
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
const styles = {
  OPEN: "bg-yellow-100 text-yellow-700 border-yellow-200",

  PENDING_ACCEPTANCE:
    "bg-orange-100 text-orange-700 border-orange-200",

  ACCEPTED:
    "bg-blue-100 text-blue-700 border-blue-200",

  ON_THE_WAY:
    "bg-indigo-100 text-indigo-700 border-indigo-200",

  ARRIVED:
    "bg-purple-100 text-purple-700 border-purple-200",

  IN_PROGRESS:
    "bg-cyan-100 text-cyan-700 border-cyan-200",

  COMPLETED:
    "bg-green-100 text-green-700 border-green-200",

  CANCELLED:
    "bg-red-100 text-red-700 border-red-200",

  REJECTED:
    "bg-gray-100 text-gray-700 border-gray-300",
};

  return (
    <span
      className={`rounded-full border px-3 py-1 text-sm font-medium ${
        styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
