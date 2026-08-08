import { prisma } from "@/lib/prisma";

export async function getWorkerProfile(userId: string) {
  const worker = await prisma.worker.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!worker) {
    throw new Error("Worker profile not found.");
  }

  return {
    id: worker.id,

    name: worker.user.name,
    email: worker.user.email,

    bio: worker.bio,
    experience: worker.experience,

    rating: worker.rating,
    completedJobs: worker.completedJobs,

    isAvailable: worker.isAvailable,

    phone: worker.phone,
    profileImage: worker.profileImage,

    skill: worker.skill,

    state: worker.state,
    city: worker.city,
    area: worker.area,
    pincode: worker.pincode,

    latitude: worker.latitude,
    longitude: worker.longitude,
  };
}
