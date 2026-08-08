import { prisma } from "@/lib/prisma";
import { mapWorkerJob } from "./jobMapper";
export async function getWorkerJobs(userId: string) {
  const worker = await prisma.worker.findUnique({
    where: {
      userId,
    },
  });

  console.log("Worker:", worker);

  if (!worker) {
    throw new Error("Worker profile not found.");
  }

  const jobs = await prisma.job.findMany({
    where: {
      workerId: worker.id,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          price: true,
          category: true,
          imageUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return jobs.map(mapWorkerJob);
}
