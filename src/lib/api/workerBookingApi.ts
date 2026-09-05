import type {
  BookingAction,
  WorkerBooking,
} from "@/types/workerBooking";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login to continue.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export async function getWorkerBookings(): Promise<WorkerBooking[]> {
  const response = await fetch("/api/workers/bookings", {
    method: "GET",
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  const data = await handleResponse<{
    success: boolean;
    bookings: WorkerBooking[];
  }>(response);

  return data.bookings;
}

export async function getWorkerBooking(
  bookingId: string
): Promise<WorkerBooking> {
  const response = await fetch(`/api/workers/bookings/${bookingId}`, {
    method: "GET",
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  const data = await handleResponse<{
    success: boolean;
    booking: WorkerBooking;
  }>(response);

  return data.booking;
}

export async function updateWorkerBooking(
  bookingId: string,
  action: BookingAction
): Promise<WorkerBooking> {
  const response = await fetch(`/api/workers/bookings/${bookingId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ action }),
  });

  const data = await handleResponse<{
    success: boolean;
    booking: WorkerBooking;
  }>(response);

  return data.booking;
}
