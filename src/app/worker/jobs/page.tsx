"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { JobStatus } from "@prisma/client";
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Clock,
  History,
  Inbox,
  IndianRupee,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import JobActions from "@/components/worker/jobs/JobActions";
import { useWorkerJobActions } from "@/hooks/useWorkerJobActions";
import { useWorkerJobs } from "@/hooks/useWorkerJobs";
import { JobAction } from "@/types/jobAction";
import { WorkerJob } from "@/types/workerJob";

type JobTab = "all" | "pending" | "active" | "history";

const TABS: Array<{
  key: JobTab;
  label: string;
  icon: LucideIcon;
}> = [
  { key: "all", label: "All assigned", icon: Briefcase },
  { key: "pending", label: "Pending", icon: Clock },
  { key: "active", label: "Active", icon: RefreshCw },
  { key: "history", label: "History", icon: History },
];

const WEEK_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

const ACTIVE_JOB_STATUSES: JobStatus[] = [
  JobStatus.ACCEPTED,
  JobStatus.ON_THE_WAY,
  JobStatus.ARRIVED,
  JobStatus.IN_PROGRESS,
];

const HISTORY_JOB_STATUSES: JobStatus[] = [
  JobStatus.COMPLETED,
  JobStatus.CANCELLED,
  JobStatus.REJECTED,
];

function useCountUp(target: number, duration = 900, delay = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let rafId: number | undefined;

    const timer = window.setTimeout(() => {
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);

        setValue(Math.round(target * eased));

        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        }
      };

      rafId = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timer);

      if (rafId !== undefined) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [target, duration, delay]);

  return value;
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-IN");
}

function formatLocation(job: WorkerJob) {
  const parts = [job.address.area, job.address.city].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(", ");
  }

  if (job.address.state) {
    return job.address.state;
  }

  return "Location not shared";
}

function isRecentWeek(value: string | Date, dayIndex: number) {
  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const now = new Date();

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (6 - dayIndex));

  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  return date >= start && date < end;
}

function getStatusMeta(status: JobStatus) {
  switch (status) {
    case JobStatus.PENDING_ACCEPTANCE:
      return {
        label: "Pending",
        bg: "#E85D4C1A",
        fg: "#E85D4C",
        icon: Clock,
      };

    case JobStatus.ACCEPTED:
      return {
        label: "Accepted",
        bg: "#2231591A",
        fg: "#223159",
        icon: Briefcase,
      };

    case JobStatus.ON_THE_WAY:
      return {
        label: "On the way",
        bg: "#D9A4411A",
        fg: "#D9A441",
        icon: RefreshCw,
      };

    case JobStatus.ARRIVED:
      return {
        label: "Arrived",
        bg: "#8B5CF61A",
        fg: "#8B5CF6",
        icon: MapPin,
      };

    case JobStatus.IN_PROGRESS:
      return {
        label: "In progress",
        bg: "#D9A4411A",
        fg: "#D9A441",
        icon: Loader2,
      };

    case JobStatus.COMPLETED:
      return {
        label: "Completed",
        bg: "#1FA97E1A",
        fg: "#1FA97E",
        icon: CheckCircle2,
      };

    case JobStatus.CANCELLED:
      return {
        label: "Cancelled",
        bg: "#E85D4C1A",
        fg: "#E85D4C",
        icon: Clock,
      };

    case JobStatus.REJECTED:
      return {
        label: "Rejected",
        bg: "#E85D4C1A",
        fg: "#E85D4C",
        icon: Clock,
      };

    default:
      return {
        label: status.replaceAll("_", " "),
        bg: "#EEECE4",
        fg: "#5B5F6B",
        icon: Briefcase,
      };
  }
}

function StatusStamp({ status }: { status: JobStatus }) {
  const meta = getStatusMeta(status);
  const Icon = meta.icon;

  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      style={{
        backgroundColor: meta.bg,
        color: meta.fg,
      }}
    >
      <Icon
        size={12}
        className={
          status === JobStatus.IN_PROGRESS ? "animate-spin" : undefined
        }
        strokeWidth={2.6}
      />

      {meta.label}
    </span>
  );
}

function RingProgress({
  pct,
  size = 132,
}: {
  pct: number;
  size?: number;
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  const [dashOffset, setDashOffset] = useState(circumference);

  const count = useCountUp(pct, 1100, 150);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDashOffset(
        circumference - (pct / 100) * circumference,
      );
    }, 150);

    return () => {
      window.clearTimeout(timer);
    };
  }, [circumference, pct]);

  return (
    <div
      className="relative shrink-0"
      style={{
        width: size,
        height: size,
      }}
    >
      <svg
        viewBox="0 0 120 120"
        className="h-full w-full -rotate-90"
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#EEECE4"
          strokeWidth="10"
        />

        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#D9A441"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition:
              "stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-semibold tabular-nums text-[#171A21]">
          {count}%
        </span>

        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#5B5F6B]">
          Completed
        </span>
      </div>
    </div>
  );
}

function WeekChart({
  data,
  labels,
}: {
  data: number[];
  labels: string[];
}) {
  const max = Math.max(...data, 1);

  return (
    <div className="flex h-24 items-end justify-between gap-2">
      {data.map((value, index) => (
        <div
          key={index}
          className="flex flex-1 flex-col items-center gap-2"
        >
          <div className="flex h-16 w-full items-end overflow-hidden rounded-lg bg-[#F7F6F2]">
            <div
              className="w-full origin-bottom rounded-lg bg-gradient-to-t from-[#223159] to-[#3E5286]"
              style={{
                height: `${(value / max) * 100}%`,
                animation:
                  "growUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
                animationDelay: `${300 + index * 70}ms`,
                transform: "scaleY(0)",
              }}
            />
          </div>

          <span className="text-[10px] font-semibold text-[#5B5F6B]">
            {labels[index]}
          </span>
        </div>
      ))}
    </div>
  );
}

function StatTicket({
  label,
  value,
  prefix,
  icon: Icon,
  accent,
  index,
}: {
  label: string;
  value: number;
  prefix?: string;
  icon: LucideIcon;
  accent: string;
  index: number;
}) {
  const count = useCountUp(value, 900, index * 100);

  return (
    <div
      className="reveal relative rounded-2xl border border-[#E4E1D8] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-12px_rgba(23,26,33,0.18)]"
      style={{
        animationDelay: `${140 + index * 90}ms`,
      }}
    >
      <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#F7F6F2]" />

      <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#F7F6F2]" />

      <div className="absolute left-4 right-4 top-[52px] border-t border-dashed border-[#E4E1D8]" />

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5B5F6B]">
          {label}
        </span>

        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `${accent}1A`,
          }}
        >
          <Icon
            size={16}
            color={accent}
            strokeWidth={2.4}
          />
        </span>
      </div>

      <div className="mt-6 font-mono text-3xl font-semibold tabular-nums text-[#171A21]">
        {prefix && (
          <span className="mr-0.5 align-top text-lg text-[#5B5F6B]">
            {prefix}
          </span>
        )}

        {count.toLocaleString("en-IN")}
      </div>
    </div>
  );
}

function TabBar({
  active,
  onChange,
  counts,
}: {
  active: JobTab;
  onChange: (tab: JobTab) => void;
  counts: Record<JobTab, number>;
}) {
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const btnRefs =
    useRef<Array<HTMLButtonElement | null>>([]);

  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
  });

  useLayoutEffect(() => {
    const index = TABS.findIndex(
      (tab) => tab.key === active,
    );

    const button = btnRefs.current[index];
    const container = containerRef.current;

    if (button && container) {
      const containerRect =
        container.getBoundingClientRect();

      const buttonRect =
        button.getBoundingClientRect();

      setIndicator({
        left:
          buttonRect.left -
          containerRect.left,
        width: buttonRect.width,
      });
    }
  }, [active]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-1 overflow-x-auto border-b border-[#E4E1D8] no-scrollbar"
    >
      {TABS.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = active === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            ref={(element) => {
              btnRefs.current[index] = element;
            }}
            onClick={() => onChange(tab.key)}
            className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "text-[#171A21]"
                : "text-[#5B5F6B] hover:text-[#171A21]"
            }`}
          >
            <Icon
              size={15}
              strokeWidth={2.2}
            />

            {tab.label}

            <span
              className={`min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-[11px] font-semibold transition-colors ${
                isActive
                  ? "bg-[#223159] text-white"
                  : "bg-[#EEECE4] text-[#5B5F6B]"
              }`}
            >
              {counts[tab.key]}
            </span>
          </button>
        );
      })}

      <span
        className="absolute bottom-0 h-[2px] rounded-full bg-[#D9A441] transition-all duration-300 ease-out"
        style={{
          left: indicator.left,
          width: indicator.width,
        }}
      />
    </div>
  );
}

function JobCard({
  job,
  index,
  onAction,
}: {
  job: WorkerJob;
  index: number;
  onAction?: (
    jobId: string,
    action: JobAction,
  ) => void;
}) {
  const [open, setOpen] = useState(false);

  const initials = job.customer.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const meta = getStatusMeta(job.status);

  return (
    <div
      className="reveal group rounded-2xl border border-[#E4E1D8] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D9D5C6] hover:shadow-[0_16px_40px_-16px_rgba(23,26,33,0.22)]"
      style={{
        animationDelay: `${120 + index * 100}ms`,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${meta.fg}1A`,
            }}
          >
            <Briefcase
              size={18}
              color={meta.fg}
              strokeWidth={2.2}
            />
          </span>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-[#171A21]">
              {job.service.name}
            </h3>

            <p className="text-sm text-[#5B5F6B]">
              {job.service.category ||
                "General Service"}
            </p>
          </div>
        </div>

        <StatusStamp status={job.status} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 border-t border-dashed border-[#E4E1D8] pt-5 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#223159]/10 text-xs font-semibold text-[#223159]">
            {initials}
          </span>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5B5F6B]">
              Customer
            </p>

            <p className="truncate text-sm font-medium text-[#171A21]">
              {job.customer.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E85D4C]/10">
            <MapPin
              size={15}
              className="text-[#E85D4C]"
            />
          </span>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5B5F6B]">
              Location
            </p>

            <p className="truncate text-sm font-medium text-[#171A21]">
              {formatLocation(job)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1FA97E]/10">
            <IndianRupee
              size={15}
              className="text-[#1FA97E]"
            />
          </span>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5B5F6B]">
              Budget payout
            </p>

            <p className="font-mono text-sm font-semibold text-[#171A21]">
              ₹{formatCurrency(job.budget)}
            </p>
          </div>
        </div>
      </div>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{
          gridTemplateRows: open
            ? "1fr"
            : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <p className="pt-4 pr-4 text-sm leading-relaxed text-[#5B5F6B]">
            {job.description ||
              "No job description was provided for this task."}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-dashed border-[#E4E1D8] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <JobActions
          status={job.status}
          onAction={(action) =>
            onAction?.(job.id, action)
          }
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setOpen((current) => !current)
            }
            className="flex items-center gap-1.5 rounded-xl border border-[#E4E1D8] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.06em] text-[#5B5F6B] transition-colors hover:border-[#223159] hover:text-[#171A21]"
          >
            View summary

            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          <Link
            href={`/worker/jobs/${job.id}`}
            className="group/btn inline-flex items-center gap-1.5 rounded-xl bg-[#223159] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#1a2646] active:scale-[0.97]"
          >
            View details

            <ArrowUpRight
              size={15}
              className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  tab,
}: {
  tab: Exclude<JobTab, "all">;
}) {
  const copy = {
    pending: {
      title: "No pending requests",
      body: "New job requests will show up here the moment a customer books you.",
    },

    active: {
      title: "Nothing in progress",
      body: "Accept a pending request to start a job. It will appear here while it’s underway.",
    },

    history: {
      title: "No history yet",
      body: "Completed, cancelled, and rejected jobs will collect here over time.",
    },
  }[tab];

  return (
    <div className="reveal flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E4E1D8] bg-white px-6 py-16 text-center">
      <span className="mb-4 flex h-12 w-12 animate-bounce-slow items-center justify-center rounded-full bg-[#F7F6F2]">
        <Inbox
          size={20}
          className="text-[#5B5F6B]"
        />
      </span>

      <p className="font-semibold text-[#171A21]">
        {copy.title}
      </p>

      <p className="mt-1 max-w-xs text-sm text-[#5B5F6B]">
        {copy.body}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-6 w-36 rounded bg-white/70" />
        <div className="h-4 w-72 rounded bg-white/60" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-72 rounded-2xl bg-white/70 lg:col-span-2" />
        <div className="h-72 rounded-2xl bg-[#223159]/20" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-32 rounded-2xl bg-white/70"
            />
          ),
        )}
      </div>

      <div className="h-80 rounded-2xl bg-white/70" />
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-600">
        <RefreshCw size={28} />
      </div>

      <h2 className="text-xl font-bold text-[#171A21]">
        Failed to load jobs
      </h2>

      <p className="mt-2 max-w-sm text-sm text-[#5B5F6B]">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-6 flex items-center gap-2 rounded-xl bg-[#223159] px-5 py-3 font-semibold text-white transition hover:opacity-95"
      >
        <RefreshCw size={16} />
        Try again
      </button>
    </div>
  );
}

export default function WorkerJobsPage() {
  const {
    jobs,
    loading,
    error,
    refresh,
  } = useWorkerJobs();

  const { performAction } =
    useWorkerJobActions();

  const [activeTab, setActiveTab] =
    useState<JobTab>("all");

  const [spinning, setSpinning] =
    useState(false);

  async function handleAction(
    jobId: string,
    action: JobAction,
  ) {
    if (action === "view") {
      return;
    }

    try {
      await performAction(jobId, action);
      await refresh();
    } catch (actionError) {
      console.error(
        "Action error:",
        actionError,
      );
    }
  }

  const groupedJobs = useMemo(() => {
    const pending = jobs.filter(
      (job) =>
        job.status ===
        JobStatus.PENDING_ACCEPTANCE,
    );

    const active = jobs.filter((job) =>
      ACTIVE_JOB_STATUSES.includes(
        job.status,
      ),
    );

    const history = jobs.filter((job) =>
      HISTORY_JOB_STATUSES.includes(
        job.status,
      ),
    );

    return {
      all: jobs,
      pending,
      active,
      history,
    };
  }, [jobs]);

  const filteredJobs =
    groupedJobs[activeTab];

  const completedJobs = jobs.filter(
    (job) =>
      job.status === JobStatus.COMPLETED,
  );

  const completionRate =
    jobs.length > 0
      ? Math.round(
          (completedJobs.length /
            jobs.length) *
            100,
        )
      : 0;

  const totalPayout = jobs.reduce(
    (sum, job) => sum + job.budget,
    0,
  );

  const averageJobValue =
    jobs.length > 0
      ? Math.round(
          totalPayout / jobs.length,
        )
      : 0;

  const completionCount =
    useCountUp(
      completionRate,
      900,
    );

  const weekData = useMemo(() => {
    return WEEK_LABELS.map(
      (_, index) =>
        jobs.filter((job) =>
          isRecentWeek(
            job.createdAt,
            index,
          ),
        ).length,
    );
  }, [jobs]);

  const counts: Record<
    JobTab,
    number
  > = {
    all: groupedJobs.all.length,
    pending:
      groupedJobs.pending.length,
    active:
      groupedJobs.active.length,
    history:
      groupedJobs.history.length,
  };

  function refreshWithSpin() {
    setSpinning(true);

    void refresh().finally(() => {
      window.setTimeout(() => {
        setSpinning(false);
      }, 700);
    });
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={refreshWithSpin}
      />
    );
  }

  return (
    <div className="relative space-y-6 overflow-hidden pb-12">
      <style>{`
        @keyframes revealUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .reveal {
          opacity: 0;
          animation: revealUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes growUp {
          to {
            transform: scaleY(1);
          }
        }

        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        .animate-bounce-slow {
          animation: bounceSlow 2.4s ease-in-out infinite;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal,
          .animate-bounce-slow {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      <div className="absolute -right-24 top-0 h-64 w-64 rounded-full bg-[#D9A441]/10 blur-3xl" />

      <div className="absolute left-1/3 top-20 h-56 w-56 rounded-full bg-[#1FA97E]/10 blur-3xl" />

      <header
        className="reveal relative flex flex-col gap-4 rounded-3xl border border-[#E4E1D8] bg-white/90 p-5 shadow-[0_14px_40px_-26px_rgba(23,26,33,0.25)] backdrop-blur"
        style={{
          animationDelay: "0ms",
        }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5B5F6B]">
              <Search size={13} />
              Worker jobs
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#171A21] md:text-[28px]">
              My assigned jobs
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-[#5B5F6B]">
              Accept pending requests,
              coordinate tasks, and track
              job history.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshWithSpin}
            className="flex items-center gap-2 rounded-xl border border-[#E4E1D8] bg-white px-3.5 py-2 text-sm font-medium text-[#171A21] transition hover:border-[#223159]"
          >
            <RefreshCw
              size={14}
              className={
                spinning
                  ? "animate-spin"
                  : undefined
              }
            />

            Refresh list
          </button>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <div
          className="reveal relative overflow-hidden rounded-3xl border border-[#E4E1D8] bg-white p-6 shadow-[0_14px_40px_-26px_rgba(23,26,33,0.25)] lg:col-span-2"
          style={{
            animationDelay: "40ms",
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5B5F6B]">
                <Briefcase size={13} />
                Job completion
              </div>

              <div className="mt-2 font-mono text-4xl font-semibold tabular-nums text-[#171A21] md:text-5xl">
                <span className="mr-1 align-top text-2xl text-[#5B5F6B]">
                  %
                </span>

                {completionCount}
              </div>
            </div>

            <div className="rounded-2xl bg-[#F7F6F2] p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab.key)
                  }
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                    activeTab === tab.key
                      ? "bg-[#223159] text-white shadow-sm"
                      : "text-[#5B5F6B] hover:text-[#171A21]"
                  }`}
                >
                  {tab.key}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <RingProgress
              pct={completionRate}
            />
          </div>
        </div>

        <div
          className="reveal flex flex-col items-center justify-center gap-3 rounded-3xl bg-[#223159] p-6 text-white"
          style={{
            animationDelay: "90ms",
          }}
        >
          <div className="flex items-center gap-2 self-start text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60">
            <Sparkles size={14} />
            Jobs this week
          </div>

          <WeekChart
            data={weekData}
            labels={WEEK_LABELS}
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatTicket
          label="Total payout potential"
          value={totalPayout}
          prefix="₹"
          icon={IndianRupee}
          accent="#D9A441"
          index={0}
        />

        <StatTicket
          label="Avg. job value"
          value={averageJobValue}
          prefix="₹"
          icon={Wallet}
          accent="#223159"
          index={1}
        />

        <StatTicket
          label="Completion rate"
          value={completionRate}
          icon={CheckCircle2}
          accent="#1FA97E"
          index={2}
        />
      </section>

      <TabBar
        active={activeTab}
        onChange={setActiveTab}
        counts={counts}
      />

      <section className="space-y-4">
        {filteredJobs.length === 0 ? (
          activeTab === "pending" ||
          activeTab === "active" ||
          activeTab === "history" ? (
            <EmptyState
              tab={activeTab}
            />
          ) : (
            <div className="reveal rounded-2xl border border-dashed border-[#E4E1D8] bg-white px-6 py-12 text-center text-sm text-[#5B5F6B]">
              No jobs found for this
              tab.
            </div>
          )
        ) : (
          filteredJobs.map(
            (job, index) => (
              <JobCard
                key={`${activeTab}-${job.id}`}
                job={job}
                index={index}
                onAction={handleAction}
              />
            )
          )
        )}
      </section>
    </div>
  );
}
