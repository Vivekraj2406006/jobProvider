import { prisma } from "@/lib/prisma";
import { JobStatus } from "@prisma/client";
import { WorkerDashboardData } from "@/types/worker";

export async function getWorkerDashboard(
  userId: string,
): Promise<WorkerDashboardData> {
  // Find worker profile
  const worker = await prisma.worker.findUnique({
    where: {
      userId,
    },
    include: {
      user: true,
    },
  });

  if (!worker) {
    throw new Error("Worker profile not found.");
  }

  // Dashboard statistics
  const [assignedJobs, activeJobs, completedJobs] = await Promise.all([
    prisma.job.count({
      where: {
        workerId: worker.id,
        status: JobStatus.PENDING_ACCEPTANCE,
      },
    }),

    prisma.job.count({
      where: {
        workerId: worker.id,
        status: {
          in: [
            JobStatus.ACCEPTED,
            JobStatus.ON_THE_WAY,
            JobStatus.ARRIVED,
            JobStatus.IN_PROGRESS,
          ],
        },
      },
    }),

    prisma.job.count({
      where: {
        workerId: worker.id,
        status: JobStatus.COMPLETED,
      },
    }),
  ]);

  // Current working job
  const activeJobRecord = await prisma.job.findFirst({
    where: {
      workerId: worker.id,
      status: {
        in: [
          JobStatus.ACCEPTED,
          JobStatus.ON_THE_WAY,
          JobStatus.ARRIVED,
          JobStatus.IN_PROGRESS,
        ],
      },
    },
    include: {
      customer: true,
      service: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const activeJob = activeJobRecord
    ? {
        id: activeJobRecord.id,
        customer: activeJobRecord.customer.name,
        service: activeJobRecord.service.name,
        location: [
          activeJobRecord.area,
          activeJobRecord.city,
          activeJobRecord.state,
        ]
          .filter(Boolean)
          .join(", "),
        budget: activeJobRecord.budget,
        status: activeJobRecord.status,
      }
    : null;

  // Recent jobs
  const recentJobRecords = await prisma.job.findMany({
    where: {
      workerId: worker.id,
    },
    include: {
      service: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
  });

  const recentJobs = recentJobRecords.map((job) => ({
    id: job.id,
    service: job.service.name,
    amount: job.budget,
    status: job.status,
    date: job.updatedAt.toISOString(),
  }));

  return {
    workerName: worker.user.name,

    stats: {
      assignedJobs,
      activeJobs,
      completedJobs,
      rating: worker.rating,
    },

    activeJob,

    recentJobs,
  };
}
