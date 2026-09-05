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

export type BookingAction =
  | "accept"
  | "reject"
  | "startJourney"
  | "markArrived"
  | "startWork"
  | "complete";

export interface WorkerBookingDetails {
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

  package: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    durationMin: number;
  };

  address: {
    name: string;
    phone: string;
    addressLine: string;
    area: string | null;
    city: string;
    state: string;
    pincode: string;
    latitude: number | null;
    longitude: number | null;
  };

  scheduledDate: Date;
  startTime: Date;
  endTime: Date;

  status: BookingStatus;

  basePrice: number;
  platformFee: number;
  discount: number;
  totalAmount: number;

  notes: string | null;

  createdAt: Date;
  updatedAt: Date;
}

/*
 * Alias used by the frontend.
 *
 * The backend mapper currently uses WorkerBookingDetails,
 * while frontend code can use WorkerBooking.
 */
export type WorkerBooking = WorkerBookingDetails;
