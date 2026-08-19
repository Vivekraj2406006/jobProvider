"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Briefcase,
  Calendar,
  IndianRupee,
  RefreshCw,
  Search,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { useWorkerEarnings } from "@/hooks/useWorkerEarnings";

const TABS = ["today", "week", "month"] as const;

type TabKey = (typeof TABS)[number];

type EarningsJob = {
  id: string;
  description: string;
  budget: number;
  updatedAt: string;
};

type EarningsData = {
  totalEarnings: number;
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  totalJobs: number;
  averagePerJob: number;
  jobs: EarningsJob[];
};

const GOAL_TARGET = 2000;

function formatCurrency(value: number) {
  return value.toLocaleString("en-IN");
}

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;

    if (raf.current !== null) {
      cancelAnimationFrame(raf.current);
    }

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * eased));

      if (progress < 1) {
        raf.current = requestAnimationFrame(tick);
      }
    };

    raf.current = requestAnimationFrame(tick);

    return () => {
      if (raf.current !== null) {
        cancelAnimationFrame(raf.current);
      }
    };
  }, [target, duration]);

  return value;
}

function getBucketIndex(date: Date, tab: TabKey, now: Date) {
  if (tab === "today") {
    return date.toDateString() === now.toDateString() ? Math.floor(date.getHours() / 2) : -1;
  }

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfDate = new Date(date);
  startOfDate.setHours(0, 0, 0, 0);
  const diff = Math.floor((startOfToday.getTime() - startOfDate.getTime()) / (1000 * 60 * 60 * 24));

  if (tab === "week") {
    return diff >= 0 && diff <= 6 ? 6 - diff : -1;
  }

  return diff >= 0 && diff <= 29 ? 29 - diff : -1;
}

function buildSparkline(jobs: EarningsJob[], tab: TabKey) {
  const length = tab === "today" ? 12 : tab === "week" ? 7 : 30;
  const values = Array.from({ length }, () => 0);
  const now = new Date();

  for (const job of jobs) {
    const date = new Date(job.updatedAt);

    if (Number.isNaN(date.getTime())) {
      continue;
    }

    const bucket = getBucketIndex(date, tab, now);

    if (bucket < 0) {
      continue;
    }

    values[bucket] += job.budget;
  }

  return values;
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function Sparkline({ data, stroke = "#D9A441" }: { data: number[]; stroke?: string }) {
  const { linePath, fillPath } = useMemo(() => {
    const width = 320;
    const height = 64;
    const maxValue = Math.max(...data, 1);
    const stepX = data.length > 1 ? width / (data.length - 1) : width;
    const points = data.map((value, index) => [index * stepX, height - (value / maxValue) * (height - 10) - 6]);
    const line = points
      .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`)
      .join(" ");
    const fill = `${line} L ${width},${height} L 0,${height} Z`;

    return { linePath: line, fillPath: fill };
  }, [data]);

  return (
    <svg viewBox="0 0 320 64" className="h-16 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill="url(#sparkFill)" />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="spark-draw"
      />
    </svg>
  );
}

function Notches() {
  return (
    <>
      <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#F7F6F2]" />
      <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#F7F6F2]" />
    </>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  isCount,
  index,
}: {
  label: string;
  value: number;
  icon: typeof TrendingUp;
  accent: string;
  isCount?: boolean;
  index: number;
}) {
  const count = useCountUp(value, 900 + index * 120);

  return (
    <div
      className="reveal relative rounded-2xl border border-[#E4E1D8] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-12px_rgba(23,26,33,0.18)]"
      style={{ animationDelay: `${120 + index * 90}ms` }}
    >
      <Notches />
      <div className="absolute left-4 right-4 top-[52px] border-t border-dashed border-[#E4E1D8]" />
      <div className="flex items-center justify-between gap-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5B5F6B]">
          {label}
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}1A` }}>
          <Icon size={16} color={accent} strokeWidth={2.4} />
        </span>
      </div>
      <div className="mt-6 font-mono text-3xl font-semibold tabular-nums text-[#171A21]">
        {isCount ? (
          count
        ) : (
          <>
            <span className="mr-0.5 align-top text-lg text-[#5B5F6B]">₹</span>
            {formatCurrency(count)}
          </>
        )}
      </div>
    </div>
  );
}

function GoalRing({ current, target }: { current: number; target: number }) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const [dashOffset, setDashOffset] = useState(circumference);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDashOffset(circumference - (pct / 100) * circumference);
    }, 150);

    return () => window.clearTimeout(timer);
  }, [circumference, pct]);

  return (
    <div
      className="reveal flex flex-col items-center justify-center gap-3 rounded-2xl bg-[#223159] p-6 text-white"
      style={{ animationDelay: "90ms" }}
    >
      <div className="flex items-center gap-2 self-start text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60">
        <Target size={14} /> Monthly goal
      </div>
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 108 108" className="h-full w-full -rotate-90">
          <circle cx="54" cy="54" r={radius} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="9" />
          <circle
            cx="54"
            cy="54"
            r={radius}
            fill="none"
            stroke="#D9A441"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-semibold">{pct}%</span>
        </div>
      </div>
      <p className="text-center text-sm text-white/70">
        <span className="font-mono text-white">₹{formatCurrency(current)}</span> of ₹{formatCurrency(target)} this month
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 w-32 rounded bg-white/60" />
        <div className="h-4 w-72 rounded bg-white/50" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-72 rounded-2xl bg-white/60 lg:col-span-2" />
        <div className="h-72 rounded-2xl bg-[#223159]/20" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-32 rounded-2xl bg-white/60" />
        ))}
      </div>

      <div className="h-80 rounded-2xl bg-white/60" />
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-600">
        <AlertCircle size={28} />
      </div>
      <h2 className="text-xl font-bold text-[#171A21]">Failed to load earnings</h2>
      <p className="mt-2 max-w-sm text-sm text-[#5B5F6B]">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 flex items-center gap-2 rounded-xl bg-[#223159] px-5 py-3 font-semibold text-white transition hover:opacity-95"
      >
        <RefreshCw size={16} />
        Try again
      </button>
    </div>
  );
}

export default function EarningsPage() {
  const { earnings, loading, error, refresh } = useWorkerEarnings();
  const [tab, setTab] = useState<TabKey>("month");
  const [spinning, setSpinning] = useState(false);

  const derived = useMemo(() => {
    const data = earnings as EarningsData | null;
    const jobs = [...(data?.jobs ?? [])].sort(
      (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
    );

    const totalEarnings = data?.totalEarnings ?? jobs.reduce((sum, job) => sum + job.budget, 0);
    const monthlyEarnings = data?.monthlyEarnings ?? totalEarnings;
    const weeklyEarnings = data?.weeklyEarnings ?? totalEarnings;
    const todayEarnings = data?.todayEarnings ?? totalEarnings;
    const totalJobs = data?.totalJobs ?? jobs.length;
    const averagePerJob = data?.averagePerJob ?? (totalJobs ? totalEarnings / totalJobs : 0);

    return {
      totalEarnings,
      monthlyEarnings,
      weeklyEarnings,
      todayEarnings,
      totalJobs,
      averagePerJob,
      jobs,
      spark: buildSparkline(jobs, tab),
    };
  }, [earnings, tab]);

  const heroValue = useCountUp(
    tab === "today"
      ? derived.todayEarnings
      : tab === "week"
        ? derived.weeklyEarnings
        : derived.monthlyEarnings,
    900,
  );

  function handleRefresh() {
    setSpinning(true);
    void refresh();
    window.setTimeout(() => setSpinning(false), 700);
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRefresh} />;
  }

  if (!earnings) {
    return (
      <ErrorState
        message="No completed payouts or service bookings were found on this account yet."
        onRetry={handleRefresh}
      />
    );
  }

  const stats = [
    { label: "Total revenue", value: derived.totalEarnings, icon: TrendingUp, accent: "#D9A441" },
    { label: "Completed payouts", value: derived.totalJobs, icon: Briefcase, accent: "#1FA97E", isCount: true },
    { label: "Average / assignment", value: Math.round(derived.averagePerJob), icon: Wallet, accent: "#223159" },
  ];

  const transactions = derived.jobs.slice(0, 5);

  return (
    <div className="relative space-y-6 overflow-hidden pb-12">
      <style>{`\n        @keyframes revealUp {\n          from { opacity: 0; transform: translateY(14px); }\n          to { opacity: 1; transform: translateY(0); }\n        }\n        .reveal {\n          opacity: 0;\n          animation: revealUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;\n        }\n        @keyframes drawLine {\n          from { stroke-dashoffset: 340; }\n          to { stroke-dashoffset: 0; }\n        }\n        .spark-draw {\n          stroke-dasharray: 340;\n          stroke-dashoffset: 340;\n          animation: drawLine 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;\n          animation-delay: 0.2s;\n        }\n        @media (prefers-reduced-motion: reduce) {\n          .reveal,\n          .spark-draw {\n            animation: none !important;\n            opacity: 1 !important;\n          }\n        }\n      `}</style>

      <div className="absolute -right-24 top-0 h-64 w-64 rounded-full bg-[#D9A441]/10 blur-3xl" />
      <div className="absolute left-1/3 top-20 h-56 w-56 rounded-full bg-[#1FA97E]/10 blur-3xl" />

      <header
        className="reveal relative flex flex-col gap-4 rounded-3xl border border-[#E4E1D8] bg-white/90 p-5 shadow-[0_14px_40px_-26px_rgba(23,26,33,0.25)] backdrop-blur"
        style={{ animationDelay: "0ms" }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5B5F6B]">
              <Calendar size={13} /> Worker earnings
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#171A21] md:text-[28px]">Earnings</h1>
            <p className="mt-1 max-w-2xl text-sm text-[#5B5F6B]">
              Track payouts, inspect settlement statements, and analyze job frequency stats.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-[#E4E1D8] bg-[#F7F6F2] px-3 py-2 text-[#5B5F6B]">
              <Search size={15} />
              <span className="text-sm">Search payouts, jobs, or dates</span>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 rounded-xl border border-[#E4E1D8] bg-white px-3.5 py-2 text-sm font-medium text-[#171A21] transition hover:border-[#223159]"
            >
              <RefreshCw size={14} className={spinning ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <div
          className="reveal relative overflow-hidden rounded-3xl border border-[#E4E1D8] bg-white p-6 shadow-[0_14px_40px_-26px_rgba(23,26,33,0.25)] lg:col-span-2"
          style={{ animationDelay: "40ms" }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5B5F6B]">
                <Calendar size={13} />
                {tab === "today" ? "Today's payout" : tab === "week" ? "This week" : "This month"}
              </div>
              <div className="mt-2 font-mono text-4xl font-semibold tabular-nums text-[#171A21] md:text-5xl">
                <span className="mr-1 align-top text-2xl text-[#5B5F6B]">₹</span>
                {formatCurrency(heroValue)}
              </div>
            </div>

            <div className="rounded-2xl bg-[#F7F6F2] p-1">
              {TABS.map((key) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                    tab === key ? "bg-[#223159] text-white shadow-sm" : "text-[#5B5F6B] hover:text-[#171A21]"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Sparkline key={tab} data={derived.spark} stroke="#D9A441" />
          </div>
        </div>

        <GoalRing
          current={derived.monthlyEarnings}
          target={Math.max(GOAL_TARGET, derived.monthlyEarnings || GOAL_TARGET)}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} {...stat} index={index} />
        ))}
      </section>

      <section
        className="reveal rounded-3xl border border-[#E4E1D8] bg-white p-6 shadow-[0_14px_40px_-26px_rgba(23,26,33,0.25)]"
        style={{ animationDelay: "260ms" }}
      >
        <div className="mb-1 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#171A21]">Payout statement</h2>
            <p className="text-sm text-[#5B5F6B]">Historical ledger of settled service bookings</p>
          </div>
          <IndianRupee size={16} className="text-[#5B5F6B]" />
        </div>

        <div className="relative mt-5">
          <div className="absolute bottom-2 left-[19px] top-2 w-px bg-[#E4E1D8]" />
          <ul className="space-y-1">
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <li
                  key={transaction.id}
                  className="reveal group relative flex cursor-pointer items-center gap-4 py-3.5 pl-0"
                  style={{ animationDelay: `${360 + index * 100}ms` }}
                >
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1FA97E]/10 transition-colors group-hover:bg-[#1FA97E]/20">
                    <ArrowUpRight size={16} className="text-[#1FA97E]" strokeWidth={2.4} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-[#171A21]">{transaction.description || transaction.id}</p>
                    <p className="text-xs text-[#5B5F6B]">{formatDateTime(transaction.updatedAt)}</p>
                  </div>
                  <span className="shrink-0 font-mono font-semibold text-[#1FA97E]">
                    +₹{formatCurrency(transaction.budget)}
                  </span>
                </li>
              ))
            ) : (
              <li className="rounded-2xl border border-dashed border-[#E4E1D8] p-6 text-sm text-[#5B5F6B]">
                No payout transactions are available yet.
              </li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
