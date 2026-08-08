import { JobStatus } from "@prisma/client";

export interface WorkerStats {
  assignedJobs: number;
  activeJobs: number;
  completedJobs: number;
  rating: number;
}

export interface ActiveJob {
  id: string;
  customer: string;
  service: string;
  location: string;
  budget: number;
  status: JobStatus;
}

export interface RecentJob {
  id: string;
  service: string;
  amount: number;
  status: JobStatus;
  date: string;
}

export interface WorkerDashboardData {
  workerName: string;

  stats: WorkerStats;

  activeJob: ActiveJob | null;

  recentJobs: RecentJob[];
}
