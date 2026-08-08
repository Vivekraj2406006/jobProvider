import { JobStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { JobAction } from "@/types/jobAction";

const JOB_TRANSITIONS: Record<
  JobStatus,
  Partial<Record<JobAction, JobStatus>>
> = {
  OPEN: {},

  PENDING_ACCEPTANCE: {
    accept: "ACCEPTED",
    reject: "REJECTED",
  },

  ACCEPTED: {
    startJourney: "ON_THE_WAY",
  },

  ON_THE_WAY: {
    markArrived: "ARRIVED",
  },

  ARRIVED: {
    startWork: "IN_PROGRESS",
  },

  IN_PROGRESS: {
    complete: "COMPLETED",
  },

  COMPLETED: {},

  CANCELLED: {},

  REJECTED: {},
};

export async function updateJobStatus(
  workerUserId: string,
  jobId: string,
  action: JobAction,
) {
  // Find worker
  const worker = await prisma.worker.findUnique({
    where: {
      userId: workerUserId,
    },
  });

  if (!worker) {
    throw new Error("Worker not found.");
  }

  // Find job
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new Error("Job not found.");
  }

  // Verify ownership
  if (job.workerId !== worker.id) {
    throw new Error("This job is not assigned to you.");
  }

  // Validate transition
  const nextStatus = JOB_TRANSITIONS[job.status]?.[action];

  if (!nextStatus) {
    throw new Error(`Cannot perform "${action}" when job is "${job.status}".`);
  }

  // Transaction
  return await prisma.$transaction(async (tx) => {
    const updatedJob = await tx.job.update({
      where: {
        id: job.id,
      },
      data: {
        status: nextStatus,
      },
    });

    // Worker state changes
    switch (nextStatus) {
      case "ACCEPTED":
        await tx.worker.update({
          where: {
            id: worker.id,
          },
          data: {
            isAvailable: false,
          },
        });
        break;

      case "COMPLETED":
        await tx.worker.update({
          where: {
            id: worker.id,
          },
          data: {
            isAvailable: true,
            completedJobs: {
              increment: 1,
            },
          },
        });
        break;

      default:
        break;
    }

    return updatedJob;
  });
}
