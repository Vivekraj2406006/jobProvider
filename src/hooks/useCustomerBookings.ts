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

  const refreshBooking = useCallback(
    async (showLoader = true) => {
      if (!bookingId) {
        setError("Booking ID is required.");
        setLoading(false);
        return;
      }

      try {
        if (showLoader) {
          setLoading(true);
        }

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
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [bookingId],
  );

  useEffect(() => {
    refreshBooking();
  }, [refreshBooking]);

  useEffect(() => {
    if (!booking) {
      return;
    }

    const activeStatuses: CustomerBooking["status"][] = [
      "PENDING",
      "ASSIGNED",
      "ACCEPTED",
      "ON_THE_WAY",
      "ARRIVED",
      "IN_PROGRESS",
    ];

    if (!activeStatuses.includes(booking.status)) {
      return;
    }

    const interval = window.setInterval(() => {
      refreshBooking(false);
    }, 10000);

    return () => {
      window.clearInterval(interval);
    };
  }, [booking, refreshBooking]);

  return {
    booking,
    loading,
    error,
    refreshBooking: () => refreshBooking(true),
  };
}
