export interface CreateBookingInput {
  serviceId: string;
  packageId: string;
  addressId: string;
  scheduledDate: string;
  startTime: string;
  notes?: string;
}

interface CreateBookingResponse {
  success: boolean;
  message?: string;
  booking?: unknown;
}

export async function createBooking(
  input: CreateBookingInput
) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login to continue");
  }

  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const data: CreateBookingResponse =
    await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to create booking"
    );
  }

  return data.booking;
}
