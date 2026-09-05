"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getWorkerBookings,
  getWorkerBooking,
  updateWorkerBooking,
} from "@/lib/api/workerBookingApi";

import type {
  BookingAction,
  WorkerBooking,
} from "@/types/workerBooking";

export function useWorkerBookings() {
  const [bookings, setBookings] = useState<WorkerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getWorkerBookings();

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

export function useWorkerBooking(bookingId: string) {
  const [booking, setBooking] = useState<WorkerBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshBooking = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getWorkerBooking(bookingId);

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

export function useWorkerBookingActions(
  bookingId: string,
  onSuccess?: (booking: WorkerBooking) => void
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performAction = useCallback(
    async (action: BookingAction) => {
      try {
        setLoading(true);
        setError(null);

        const booking = await updateWorkerBooking(
          bookingId,
          action
        );

        onSuccess?.(booking);

        return booking;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to update booking.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [bookingId, onSuccess]
  );

  return {
    performAction,
    loading,
    error,
  };
}
