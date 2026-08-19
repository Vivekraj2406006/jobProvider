"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  IndianRupee,
  MapPin,
  UserRound,
  Wrench,
  XCircle,
} from "lucide-react";

interface Job {
  id: string;
  description: string;
  budget?: number;
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
  const [filter, setFilter] = useState("ALL");

  const fetchJobs = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchJobs);
  }, [fetchJobs]);

  const activeStatuses = [
    "OPEN",
    "PENDING_ACCEPTANCE",
    "ACCEPTED",
    "ON_THE_WAY",
    "ARRIVED",
    "IN_PROGRESS",
  ];
  const activeJobs = jobs.filter((job) => activeStatuses.includes(job.status));
  const completedJobs = jobs.filter((job) => job.status === "COMPLETED");
  const cancelledJobs = jobs.filter((job) =>
    ["CANCELLED", "REJECTED"].includes(job.status),
  );
  const filteredJobs =
    filter === "ALL"
      ? jobs
      : filter === "ACTIVE"
        ? activeJobs
        : filter === "COMPLETED"
          ? completedJobs
          : cancelledJobs;

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-48 animate-pulse rounded-3xl bg-white shadow-sm"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          title="Total bookings"
          count={jobs.length}
          icon={<Wrench size={18} />}
        />
        <StatCard
          title="In progress"
          count={activeJobs.length}
          icon={<Clock3 size={18} />}
          accent
        />
        <StatCard
          title="Completed"
          count={completedJobs.length}
          icon={<CheckCircle2 size={18} />}
        />
      </div>
      <div className="flex flex-wrap gap-2 border-b border-[#eadfce] pb-3">
        {[
          ["ALL", "All jobs"],
          ["ACTIVE", "In progress"],
          ["COMPLETED", "Completed"],
          ["CANCELLED", "Cancelled"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === value ? "bg-[#1b2a4a] text-white" : "bg-white text-gray-500 hover:bg-[#fff0e3]"}`}
          >
            {label}{" "}
            <span className="ml-1 opacity-60">
              {value === "ALL"
                ? jobs.length
                : value === "ACTIVE"
                  ? activeJobs.length
                  : value === "COMPLETED"
                    ? completedJobs.length
                    : cancelledJobs.length}
            </span>
          </button>
        ))}
      </div>
      {filteredJobs.length === 0 ? (
        <EmptyJobs filter={filter} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  count,
  icon,
  accent = false,
}: {
  title: string;
  count: number;
  icon: ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-5 shadow-sm ${accent ? "border-[#f2d1b2] bg-[#fff5ec]" : "border-gray-100 bg-white"}`}
    >
      <div className="flex items-center justify-between text-gray-400">
        <p className="text-xs font-bold uppercase tracking-wider">{title}</p>
        <span className={accent ? "text-[#c87528]" : "text-[#1b2a4a]"}>
          {icon}
        </span>
      </div>
      <h2 className="mt-3 text-3xl font-bold text-[#1b2a4a]">{count}</h2>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const router = useRouter();
  const created = new Date(job.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="group rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff0e3] text-[#c87528]">
            <Wrench size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-[#1b2a4a]">
              {job.service?.name ?? "Service"}
            </h2>
            <p className="text-xs text-gray-400">Booked {created}</p>
          </div>
        </div>
        <StatusBadge status={job.status} />
      </div>
      <p className="mt-5 line-clamp-2 text-sm leading-6 text-gray-500">
        {job.description || "No description added."}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <IndianRupee size={14} className="text-emerald-600" />
          {job.budget || job.service?.price || 0}
        </span>
        {job.worker?.user ? (
          <span className="flex items-center gap-1.5">
            <UserRound size={14} />
            {job.worker.user.name}
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <MapPin size={14} />
            Finding a worker
          </span>
        )}
        <button
          onClick={() => router.push(`/dashboard/customer/jobs/${job.id}`)}
          className="ml-auto flex items-center gap-1 font-bold text-[#c87528] transition group-hover:gap-2"
        >
          View details <ArrowRight size={14} />
        </button>
      </div>
    </article>
  );
}

function EmptyJobs({ filter }: { filter: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-[#dfd2c1] bg-white p-12 text-center">
      <XCircle className="mx-auto text-gray-300" size={34} />
      <h2 className="mt-4 text-lg font-bold text-[#1b2a4a]">
        No {filter === "ALL" ? "jobs" : filter.toLowerCase()} yet
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        Your service requests will appear here.
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    OPEN: "bg-yellow-100 text-yellow-700 border-yellow-200",

    PENDING_ACCEPTANCE: "bg-orange-100 text-orange-700 border-orange-200",

    ACCEPTED: "bg-blue-100 text-blue-700 border-blue-200",

    ON_THE_WAY: "bg-indigo-100 text-indigo-700 border-indigo-200",

    ARRIVED: "bg-purple-100 text-purple-700 border-purple-200",

    IN_PROGRESS: "bg-cyan-100 text-cyan-700 border-cyan-200",

    COMPLETED: "bg-green-100 text-green-700 border-green-200",

    CANCELLED: "bg-red-100 text-red-700 border-red-200",

    REJECTED: "bg-gray-100 text-gray-700 border-gray-300",
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
