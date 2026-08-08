import { Prisma } from "@prisma/client";
import { WorkerJobDetails } from "@/types/workerJob";

type WorkerJobWithRelations = Prisma.JobGetPayload<{
  include: {
    customer: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    service: {
      select: {
        id: true;
        name: true;
        category: true;
        imageUrl: true;
        price: true;
      };
    };
  };
}>;

export function mapWorkerJob(job: WorkerJobWithRelations): WorkerJobDetails {
  return {
    id: job.id,

    customer: {
      id: job.customer.id,
      name: job.customer.name,
      email: job.customer.email,
    },

    service: {
      id: job.service.id,
      name: job.service.name,
      category: job.service.category,
      imageUrl: job.service.imageUrl,
    },

    budget: job.budget,

    description: job.description,

    status: job.status,

    address: {
      area: job.area,
      city: job.city,
      state: job.state,
      pincode: job.pincode,
    },

    location: {
      latitude: job.latitude,
      longitude: job.longitude,
    },

    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
}
