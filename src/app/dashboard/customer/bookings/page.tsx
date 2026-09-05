"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarCheck2,
  RefreshCw,
} from "lucide-react";

import CustomerBookingCard from "@/components/CustomerBookings/CustomerBookingCard";
import { useCustomerBookings } from "@/hooks/useCustomerBookings";

export default function CustomerBookingsPage() {
  const {
    bookings,
    loading,
    error,
    refreshBookings,
  } = useCustomerBookings();

  return (
    <main className="min-h-screen bg-[#f6f9f7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/dashboard/customer"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#66766f] transition hover:text-[#146356]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e3f0eb] text-[#146356]">
                <CalendarCheck2 className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#10201b]">
                  My bookings
                </h1>

                <p className="mt-1 text-sm text-[#71817b]">
                  View and track all your service bookings.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => refreshBookings()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d7e2dd] bg-white px-4 py-2.5 text-sm font-semibold text-[#273730] transition hover:border-[#b9cbc3] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-[#e5ebe7] bg-white p-5"
              >
                <div className="h-5 w-48 rounded bg-[#e9efec]" />
                <div className="mt-3 h-4 w-32 rounded bg-[#eef2f0]" />
                <div className="mt-6 h-4 w-full rounded bg-[#eef2f0]" />
                <div className="mt-3 h-4 w-2/3 rounded bg-[#eef2f0]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-semibold text-red-800">
              Unable to load bookings
            </h2>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => refreshBookings()}
              className="mt-4 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
            >
              Try again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#cad8d2] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#146356]">
              <CalendarCheck2 className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-[#273730]">
              No bookings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-[#71817b]">
              Your service bookings will appear here after
              you schedule a service.
            </p>

            <Link
              href="/dashboard/customer"
              className="mt-6 inline-flex rounded-xl bg-[#146356] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f5146]"
            >
              Browse services
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <CustomerBookingCard
                key={booking.id}
                booking={booking}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
