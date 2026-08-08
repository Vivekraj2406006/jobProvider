import { prisma } from "@/lib/prisma";

export async function getWorkerEarnings(userId: string) {
  const worker = await prisma.worker.findUnique({
    where: {
      userId,
    },
  });

  if (!worker) {
    throw new Error("Worker profile not found.");
  }

  const jobs = await prisma.job.findMany({
    where: {
      workerId: worker.id,
      status: "COMPLETED",
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const week = new Date(today);

  week.setDate(today.getDate() - 7);

  const month = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalEarnings = jobs.reduce((sum, job) => sum + job.budget, 0);

  const todayEarnings = jobs
    .filter((job) => job.updatedAt >= today)
    .reduce((sum, job) => sum + job.budget, 0);

  const weeklyEarnings = jobs
    .filter((job) => job.updatedAt >= week)
    .reduce((sum, job) => sum + job.budget, 0);

  const monthlyEarnings = jobs
    .filter((job) => job.updatedAt >= month)
    .reduce((sum, job) => sum + job.budget, 0);

  const totalJobs = jobs.length;

  return {
    totalEarnings,
    todayEarnings,
    weeklyEarnings,
    monthlyEarnings,
    totalJobs,
    averagePerJob: totalJobs === 0 ? 0 : Math.round(totalEarnings / totalJobs),
    jobs,
  };
}
