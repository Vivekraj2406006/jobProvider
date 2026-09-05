"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";

import CustomerBookingDetails from "@/components/CustomerBookings/CustomerBookingDetails";
import { useCustomerBooking } from "@/hooks/useCustomerBookings";

export default function CustomerBookingDetailsPage() {
  const params = useParams<{ id: string }>();
  const bookingId = params.id;

  const {
    booking,
    loading,
    error,
    refreshBooking,
  } = useCustomerBooking(bookingId);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f9f7] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="h-5 w-40 rounded bg-[#e5ece8]" />
            <div className="h-36 rounded-2xl bg-white" />
            <div className="h-64 rounded-2xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="min-h-screen bg-[#f6f9f7] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#66766f] hover:text-[#146356]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to bookings
          </Link>

          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="font-bold text-red-800">
              Booking unavailable
            </h1>

            <p className="mt-1 text-sm text-red-700">
              {error || "This booking could not be found."}
            </p>

            <button
              type="button"
              onClick={() => refreshBooking()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f9f7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#66766f] transition hover:text-[#146356]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to bookings
          </Link>

          <button
            type="button"
            onClick={() => refreshBooking()}
            className="inline-flex items-center gap-2 rounded-xl border border-[#d7e2dd] bg-white px-4 py-2.5 text-sm font-semibold text-[#273730] transition hover:border-[#b9cbc3]"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <CustomerBookingDetails booking={booking} />
      </div>
    </main>
  );
}
