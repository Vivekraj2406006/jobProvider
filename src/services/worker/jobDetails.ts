import { prisma } from "@/lib/prisma";
import { mapWorkerJob } from "./jobMapper";
export async function getWorkerJobDetails(workerUserId: string, jobId: string) {
  const worker = await prisma.worker.findUnique({
    where: {
      userId: workerUserId,
    },
  });

  if (!worker) {
    throw new Error("Worker profile not found.");
  }

  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
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
          category: true,
          imageUrl: true,
          price: true,
        },
      },
    },
  });

  if (!job) {
    throw new Error("Job not found.");
  }

  return mapWorkerJob(job);
}
