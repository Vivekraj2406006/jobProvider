import type { CustomerBooking } from "@/types/customerBooking";

interface GetCustomerBookingsResponse {
  success: boolean;
  message?: string;
  bookings?: CustomerBooking[];
}

interface GetCustomerBookingResponse {
  success: boolean;
  message?: string;
  booking?: CustomerBooking;
}

function getToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login to continue");
  }

  return token;
}

export async function getCustomerBookings(): Promise<CustomerBooking[]> {
  const token = getToken();

  const response = await fetch("/api/bookings", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: GetCustomerBookingsResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to load customer bookings.",
    );
  }

  return data.bookings ?? [];
}

export async function getCustomerBooking(
  bookingId: string,
): Promise<CustomerBooking> {
  const token = getToken();

  const response = await fetch(`/api/bookings/${bookingId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: GetCustomerBookingResponse = await response.json();

  if (!response.ok || !data.success || !data.booking) {
    throw new Error(
      data.message || "Failed to load booking.",
    );
  }

  return data.booking;
}
