export interface WorkerProfile {
  id: string;

  name: string;

  email: string;

  bio: string | null;

  experience: number;

  rating: number;

  completedJobs: number;

  isAvailable: boolean;

  phone: string | null;

  profileImage: string | null;

  skill: string[];

  state: string | null;

  city: string | null;

  area: string | null;

  pincode: string | null;

  latitude: number | null;

  longitude: number | null;
}
