import { calculateDistance } from "@/lib/distance";
import { prisma } from "@/lib/prisma";

export async function assignNearestWorker(jobId: string) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("Job not found");

  const workers = await prisma.worker.findMany({
    where: {
      isAvailable: true,
      latitude: { not: null },
      longitude: { not: null },
    },
  });
  if (workers.length === 0) return null;

  const nearestWorkers = workers
    .map((worker) => ({
      worker,
      distance: calculateDistance(
        job.latitude!,
        job.longitude!,
        worker.latitude!,
        worker.longitude!,
      ),
    }))
    .sort((a, b) => a.distance - b.distance);

  const selectedWorker = nearestWorkers[0].worker;

  await prisma.$transaction([
    prisma.job.update({
      where: {
        id: job.id,
      },
      data: {
        workerId: selectedWorker.id,
        status: "PENDING_ACCEPTANCE"
      },
    }),

    prisma.worker.update({
      where: {
        id: selectedWorker.id,
      },
      data: {
        isAvailable: false,
      },
    }),
  ]);

  return selectedWorker;
}
