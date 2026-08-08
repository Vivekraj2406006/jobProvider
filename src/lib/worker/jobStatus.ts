import { JobStatus } from "@prisma/client";

export type JobActionVariant = "primary" | "success" | "danger" | "secondary";

export interface JobAction {
  key:
    | "accept"
    | "reject"
    | "startJourney"
    | "markArrived"
    | "startWork"
    | "complete"
    | "view";

  label: string;

  variant: JobActionVariant;
}

export interface JobStatusConfig {
  label: string;

  bgColor: string;

  textColor: string;

  nextStatus?: JobStatus;

  actions: JobAction[];
}

export const JOB_STATUS: Record<JobStatus, JobStatusConfig> = {
  OPEN: {
    label: "Open",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    actions: [],
  },

  PENDING_ACCEPTANCE: {
    label: "Pending Acceptance",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",

    nextStatus: "ACCEPTED",

    actions: [
      {
        key: "accept",
        label: "Accept Job",
        variant: "success",
      },
      {
        key: "reject",
        label: "Reject",
        variant: "danger",
      },
    ],
  },

  ACCEPTED: {
    label: "Accepted",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",

    nextStatus: "ON_THE_WAY",

    actions: [
      {
        key: "startJourney",
        label: "Start Journey",
        variant: "primary",
      },
    ],
  },

  ON_THE_WAY: {
    label: "On The Way",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-700",

    nextStatus: "ARRIVED",

    actions: [
      {
        key: "markArrived",
        label: "Mark Arrived",
        variant: "primary",
      },
    ],
  },

  ARRIVED: {
    label: "Arrived",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",

    nextStatus: "IN_PROGRESS",

    actions: [
      {
        key: "startWork",
        label: "Start Work",
        variant: "primary",
      },
    ],
  },

  IN_PROGRESS: {
    label: "In Progress",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",

    nextStatus: "COMPLETED",

    actions: [
      {
        key: "complete",
        label: "Complete Job",
        variant: "success",
      },
    ],
  },

  COMPLETED: {
    label: "Completed",
    bgColor: "bg-green-100",
    textColor: "text-green-700",

    actions: [
      {
        key: "view",
        label: "View Summary",
        variant: "secondary",
      },
    ],
  },

  CANCELLED: {
    label: "Cancelled",
    bgColor: "bg-red-100",
    textColor: "text-red-700",

    actions: [
      {
        key: "view",
        label: "View Details",
        variant: "secondary",
      },
    ],
  },

  REJECTED: {
    label: "Rejected",
    bgColor: "bg-red-100",
    textColor: "text-red-700",

    actions: [
      {
        key: "view",
        label: "View Details",
        variant: "secondary",
      },
    ],
  },
};
