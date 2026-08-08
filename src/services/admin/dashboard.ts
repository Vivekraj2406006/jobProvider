import { prisma } from "@/lib/prisma";

export async function getAdminDashboard() {
  const [
    totalUsers,
    totalWorkers,
    totalCustomers,
    totalJobs,
    completedJobs,
    pendingJobs,
    cancelledJobs,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.worker.count(),

    prisma.user.count({
      where: {
        role: "CUSTOMER",
      },
    }),

    prisma.job.count(),

    prisma.job.count({
      where: {
        status: "COMPLETED",
      },
    }),

    prisma.job.count({
      where: {
        status: {
          in: [
            "OPEN",
            "PENDING_ACCEPTANCE",
            "ACCEPTED",
            "ON_THE_WAY",
            "ARRIVED",
            "IN_PROGRESS",
          ],
        },
      },
    }),

    prisma.job.count({
      where: {
        status: "CANCELLED",
      },
    }),
  ]);

  return {
    totalUsers,
    totalWorkers,
    totalCustomers,
    totalJobs,
    completedJobs,
    pendingJobs,
    cancelledJobs,
  };
}
