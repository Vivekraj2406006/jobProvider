export type BookingStatus =
  | "PENDING"
  | "ASSIGNED"
  | "ACCEPTED"
  | "ON_THE_WAY"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export interface CustomerBookingWorker {
  id: string;
  rating: number;
  experience: number;
  completedJobs: number;
  phone: string | null;
  profileImage: string | null;
  skill: string[];
  user: {
    id: string;
    name: string;
  };
}

export interface CustomerBookingService {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  imageUrl: string | null;
}

export interface CustomerBookingPackage {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMin: number;
}

export interface CustomerBookingAddress {
  id: string;
  label: string;
  name: string;
  phone: string;
  addressLine: string;
  area: string | null;
  city: string;
  state: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
}

export type BookingAttemptStatus =
  | "OFFERED"
  | "ACCEPTED"
  | "REJECTED"
  | "ASSIGNED";

export interface CustomerBookingAttempt {
  id: string;
  workerId: string;
  status: BookingAttemptStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerBooking {
  id: string;
  customerId: string;
  workerId: string | null;
  serviceId: string;
  packageId: string;
  addressId: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  basePrice: number;
  platformFee: number;
  discount: number;
  totalAmount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;

  service: CustomerBookingService;
  package: CustomerBookingPackage;
  address: CustomerBookingAddress;
  worker: CustomerBookingWorker | null;

  workerAttempts?: CustomerBookingAttempt[];
}
