import { JobStatus } from "@prisma/client";

export interface WorkerJob {
  id: string;

  customer: {
    id: string;
    name: string;
    email: string;
  };

  service: {
    id: string;
    name: string;
    category: string | null;
    imageUrl: string | null;
  };

  budget: number;

  description: string | null;

  status: JobStatus;

  address: {
    state: string | null;
    city: string | null;
    area: string | null;
    pincode: string | null;
  };

  location: {
    latitude: number | null;
    longitude: number | null;
  };

  createdAt: string | Date;

  updatedAt: string | Date;
}
