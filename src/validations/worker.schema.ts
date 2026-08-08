import { z } from "zod";

export const updateWorkerProfileSchema = z.object({
  bio: z.string().min(20).optional(),
  phone: z.string().optional(),
  experience: z.number().min(0).optional(),
  skill: z.array(z.string()).optional(),
});
