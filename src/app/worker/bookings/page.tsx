"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Loader2,
} from "lucide-react";

import WorkerBookingCard from "@/components/WorkerBookings/WorkerBookingCard";
import { useWorkerBookings } from "@/hooks/useWorkerBookings";

export default function WorkerBookingsPage() {
  const {
    bookings,
    loading,
    error,
    refreshBookings,
  } = useWorkerBookings();

  const upcomingBookings = bookings.filter(
    (booking) =>
      booking.status === "ASSIGNED" ||
      booking.status === "ACCEPTED" ||
      booking.status === "ON_THE_WAY"
  );

  const activeBookings = bookings.filter(
    (booking) =>
      booking.status === "ARRIVED" ||
      booking.status === "IN_PROGRESS"
  );

  const completedBookings = bookings.filter(
    (booking) =>
      booking.status === "COMPLETED"
  );

  const otherBookings = bookings.filter(
    (booking) =>
      booking.status === "CANCELLED" ||
      booking.status === "REJECTED" ||
      booking.status === "PENDING"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f7f5]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex items-center gap-3 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading bookings...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f3f7f5]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Unable to load bookings
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>

            <button
              onClick={refreshBookings}
              className="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f7f5]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/worker"
            className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900">
                  <CalendarDays className="h-5 w-5 text-white" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    My Bookings
                  </h1>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage your assigned service bookings.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={refreshBookings}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <CalendarDays className="mx-auto h-12 w-12 text-gray-300" />

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No bookings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              New service bookings assigned to you will appear here.
            </p>

            <Link
              href="/worker"
              className="mt-6 inline-flex rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Back to dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-10">

            {/* Upcoming */}
            {upcomingBookings.length > 0 && (
              <section>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Upcoming
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Bookings that are scheduled or waiting for your action.
                  </p>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  {upcomingBookings.map((booking) => (
                    <WorkerBookingCard
                      key={booking.id}
                      booking={booking}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Active */}
            {activeBookings.length > 0 && (
              <section>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Active
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Services that are currently being handled.
                  </p>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  {activeBookings.map((booking) => (
                    <WorkerBookingCard
                      key={booking.id}
                      booking={booking}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Completed */}
            {completedBookings.length > 0 && (
              <section>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Completed
                  </h2>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  {completedBookings.map((booking) => (
                    <WorkerBookingCard
                      key={booking.id}
                      booking={booking}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Other */}
            {otherBookings.length > 0 && (
              <section>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Other Bookings
                  </h2>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  {otherBookings.map((booking) => (
                    <WorkerBookingCard
                      key={booking.id}
                      booking={booking}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
