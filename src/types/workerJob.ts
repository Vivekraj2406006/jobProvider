import { JobStatus } from "@prisma/client";

export interface CustomerInfo {
  id: string;
  name: string;
  email: string;
}

export interface ServiceInfo {
  id: string;
  name: string;
  category: string | null;
  imageUrl: string | null;
}

export interface JobAddress {
  area: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
}

export interface JobLocation {
  latitude: number | null;
  longitude: number | null;
}

export interface WorkerJob {
  id: string;

  customer: CustomerInfo;

  service: ServiceInfo;

  budget: number;

  description: string;

  status: JobStatus;

  address: JobAddress;

  location: JobLocation;

  createdAt: string | Date;

  updatedAt: string | Date;
}

export interface WorkerDashboardStats {
  totalJobs: number;
  completedJobs: number;
  activeJobs: number;
  totalEarnings: number;
  rating: number;
}

export interface WorkerJobDetails extends WorkerJob {}
