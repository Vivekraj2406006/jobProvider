"use client";

import { useCallback, useEffect, useState } from "react";

import {
  cancelCustomerBooking,
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
    void refreshBookings();
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
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

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

  const cancelBooking = useCallback(async () => {
    if (!bookingId) {
      setCancelError("Booking ID is required.");
      return null;
    }

    try {
      setCancelling(true);
      setCancelError(null);

      const updatedBooking =
        await cancelCustomerBooking(bookingId);

      setBooking(updatedBooking);

      return updatedBooking;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to cancel booking.";

      setCancelError(message);

      return null;
    } finally {
      setCancelling(false);
    }
  }, [bookingId]);

  useEffect(() => {
    void refreshBooking();
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

    /*
     * Once a booking reaches a terminal state such as
     * COMPLETED, CANCELLED, or REJECTED, polling stops.
     */
    if (!activeStatuses.includes(booking.status)) {
      return;
    }

    const interval = window.setInterval(() => {
      void refreshBooking(false);
    }, 10000);

    return () => {
      window.clearInterval(interval);
    };
  }, [booking, refreshBooking]);

  return {
    booking,
    loading,
    cancelling,
    error,
    cancelError,
    refreshBooking: () => refreshBooking(true),
    cancelBooking,
  };
}
