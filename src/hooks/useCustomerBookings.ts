"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getCustomerBooking,
  getCustomerBookings,
} from "@/lib/api/customerBookingApi";

import type { CustomerBooking } from "@/types/customerBooking";

export function useCustomerBookings() {
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getCustomerBookings();

      setBookings(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load bookings.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshBookings();
  }, [refreshBookings]);

  return {
    bookings,
    loading,
    error,
    refreshBookings,
  };
}

export function useCustomerBooking(bookingId: string) {
  const [booking, setBooking] = useState<CustomerBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshBooking = useCallback(async () => {
    if (!bookingId) {
      setError("Booking ID is required.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getCustomerBooking(bookingId);

      setBooking(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load booking.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    refreshBooking();
  }, [refreshBooking]);

  return {
    booking,
    loading,
    error,
    refreshBooking,
  };
}
