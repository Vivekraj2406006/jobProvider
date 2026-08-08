import { prisma } from "@/lib/prisma";

export async function getWorkerByUserId(userId: string) {
  return prisma.worker.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

export async function updateWorker(
  userId: string,
  data: {
    bio?: string;
    phone?: string;
    experience?: number;
    skill?: string[];
  }
) {
  return prisma.worker.update({
    where: {
      userId,
    },
    data,
  });
}
