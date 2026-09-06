"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  Clock3,
  Loader2,
  MapPin,
  Phone,
  Receipt,
  UserRound,
  X,
} from "lucide-react";

import BookingStatusTimeline from "@/components/CustomerBookings/BookingStatusTimeline";

import type { CustomerBooking } from "@/types/customerBooking";

const CustomerLiveTrackingMap = dynamic(
  () => import("./CustomerLiveTrackingMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[360px] items-center justify-center rounded-2xl border border-gray-200 bg-white text-sm text-gray-500">
        Loading live map...
      </div>
    ),
  },
);

interface CustomerBookingDetailsProps {
  booking: CustomerBooking;
  cancelling?: boolean;
  cancelError?: string | null;
  onCancel?: () => Promise<unknown>;
}

function getStatusLabel(status: CustomerBooking["status"]) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeStyle: "short",
  }).format(new Date(value));
}

function canCustomerCancel(status: CustomerBooking["status"]) {
  return (
    status === "PENDING" ||
    status === "ASSIGNED" ||
    status === "ACCEPTED"
  );
}

export default function CustomerBookingDetails({
  booking,
  cancelling = false,
  cancelError = null,
  onCancel,
}: CustomerBookingDetailsProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const isCancellable = canCustomerCancel(booking.status);

  const hasWorkerLocation =
    booking.worker !== null &&
    typeof booking.worker.latitude === "number" &&
    typeof booking.worker.longitude === "number";

  const hasCustomerLocation =
    typeof booking.address.latitude === "number" &&
    typeof booking.address.longitude === "number";

  async function handleConfirmCancel() {
    if (!onCancel || cancelling) {
      return;
    }

    const result = await onCancel();

    if (result) {
      setShowCancelModal(false);
    }
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          {/* Booking summary */}
          <section className="rounded-2xl border border-[#e4ebe7] bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7a8982]">
                  {booking.service.category || "Service"}
                </p>

                <h1 className="mt-1 text-2xl font-bold text-[#10201b]">
                  {booking.service.name}
                </h1>

                <p className="mt-1 text-sm text-[#71817b]">
                  {booking.package.name}
                </p>
              </div>

              <span className="inline-flex w-fit rounded-full border border-[#d7e4de] bg-[#edf6f2] px-3 py-1.5 text-xs font-semibold text-[#146356]">
                {getStatusLabel(booking.status)}
              </span>
            </div>

            <div className="mt-6 grid gap-4 border-t border-[#edf1ef] pt-5 sm:grid-cols-2">
              <div className="flex gap-3">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#146356]" />

                <div>
                  <p className="text-xs text-[#7a8982]">Date</p>

                  <p className="mt-1 text-sm font-semibold text-[#273730]">
                    {formatDate(booking.scheduledDate)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#146356]" />

                <div>
                  <p className="text-xs text-[#7a8982]">Time</p>

                  <p className="mt-1 text-sm font-semibold text-[#273730]">
                    {formatTime(booking.startTime)} -{" "}
                    {formatTime(booking.endTime)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Status timeline */}
          <BookingStatusTimeline status={booking.status} />

          {/* Live worker tracking */}
          {booking.status === "ON_THE_WAY" && (
            <section>
              {hasWorkerLocation ? (
                <CustomerLiveTrackingMap
                  latitude={booking.worker!.latitude as number}
                  longitude={booking.worker!.longitude as number}
                  customerLatitude={
                    hasCustomerLocation
                      ? booking.address.latitude
                      : null
                  }
                  customerLongitude={
                    hasCustomerLocation
                      ? booking.address.longitude
                      : null
                  }
                />
              ) : (
                <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <MapPin className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Tracking your worker
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        Your worker is on the way. Live location will appear
                        as soon as their current position is available.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Cancellation error */}
          {cancelError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Cancellation failed
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-700">
                    {cancelError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Service address */}
          <section className="rounded-2xl border border-[#e4ebe7] bg-white p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#146356]" />

              <div>
                <h2 className="text-lg font-bold text-[#10201b]">
                  Service address
                </h2>

                <p className="mt-2 text-sm font-semibold text-[#273730]">
                  {booking.address.label}
                </p>

                <p className="mt-1 text-sm leading-6 text-[#71817b]">
                  {booking.address.addressLine}
                  {booking.address.area
                    ? `, ${booking.address.area}`
                    : ""}
                  {`, ${booking.address.city}, ${booking.address.state} - ${booking.address.pincode}`}
                </p>
              </div>
            </div>

            {hasCustomerLocation && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${booking.address.latitude},${booking.address.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#10201b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a3028]"
              >
                <MapPin className="h-4 w-4" />
                Open in Maps
              </a>
            )}
          </section>

          {/* Price details */}
          <section className="rounded-2xl border border-[#e4ebe7] bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[#10201b]">
              Price details
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[#71817b]">
                  Base price
                </span>

                <span className="font-medium text-[#273730]">
                  ₹{booking.basePrice.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[#71817b]">
                  Platform fee
                </span>

                <span className="font-medium text-[#273730]">
                  ₹{booking.platformFee.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[#71817b]">
                  Discount
                </span>

                <span className="font-medium text-[#273730]">
                  -₹{booking.discount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-[#edf1ef] pt-4">
                <div className="flex items-center gap-2 font-bold text-[#10201b]">
                  <Receipt className="h-4 w-4 text-[#146356]" />
                  Total
                </div>

                <span className="text-lg font-bold text-[#146356]">
                  ₹{booking.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Right sidebar */}
        <aside>
          <section className="rounded-2xl border border-[#e4ebe7] bg-white p-5 sm:p-6 lg:sticky lg:top-6">
            <h2 className="text-lg font-bold text-[#10201b]">
              Your worker
            </h2>

            {booking.worker ? (
              <div className="mt-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f2ee] text-[#146356]">
                    <UserRound className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-bold text-[#273730]">
                      {booking.worker.user.name}
                    </p>

                    <p className="mt-0.5 text-sm text-[#71817b]">
                      {booking.worker.skill.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#f5f8f6] p-3">
                    <p className="text-xs text-[#7a8982]">
                      Rating
                    </p>

                    <p className="mt-1 font-semibold text-[#273730]">
                      {booking.worker.rating.toFixed(1)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#f5f8f6] p-3">
                    <p className="text-xs text-[#7a8982]">
                      Experience
                    </p>

                    <p className="mt-1 font-semibold text-[#273730]">
                      {booking.worker.experience} years
                    </p>
                  </div>
                </div>

                {booking.worker.phone && (
                  <a
                    href={`tel:${booking.worker.phone}`}
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#146356] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0f5146]"
                  >
                    <Phone className="h-4 w-4" />
                    Call worker
                  </a>
                )}
              </div>
            ) : (
              <div className="mt-5 rounded-xl bg-[#f5f8f6] p-4">
                <p className="text-sm font-semibold text-[#273730]">
                  Finding a suitable worker
                </p>

                <p className="mt-1 text-sm leading-6 text-[#71817b]">
                  We'll assign an eligible worker as soon as one
                  is available.
                </p>
              </div>
            )}

            {/* Cancel booking */}
            {isCancellable && onCancel && (
              <div className="mt-6 border-t border-[#edf1ef] pt-5">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  disabled={cancelling}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel Booking
                </button>

                <p className="mt-2 text-center text-xs leading-5 text-[#8a9691]">
                  Cancellation is available until the worker starts
                  traveling to your location.
                </p>
              </div>
            )}

            {/* Cancelled state */}
            {booking.status === "CANCELLED" && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <X className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-red-800">
                      Booking cancelled
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-700">
                      This booking is no longer active.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Completed state */}
            {booking.status === "COMPLETED" && (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      Booking completed
                    </p>

                    <p className="mt-1 text-xs leading-5 text-green-700">
                      Your service has been completed successfully.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </aside>
      </div>

      {/* Cancellation confirmation modal */}
      {showCancelModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-booking-title"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>

                <div>
                  <h2
                    id="cancel-booking-title"
                    className="text-lg font-bold text-[#10201b]"
                  >
                    Cancel this booking?
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[#71817b]">
                    Are you sure you want to cancel this booking?
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                aria-label="Close cancellation dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-[#f5f8f6] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7a8982]">
                Booking
              </p>

              <p className="mt-1 font-semibold text-[#273730]">
                {booking.service.name}
              </p>

              <p className="mt-1 text-sm text-[#71817b]">
                {formatDate(booking.scheduledDate)}
              </p>

              <p className="mt-1 text-sm text-[#71817b]">
                {formatTime(booking.startTime)} -{" "}
                {formatTime(booking.endTime)}
              </p>
            </div>

            {cancelError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {cancelError}
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Keep Booking
              </button>

              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelling && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                {cancelling
                  ? "Cancelling..."
                  : "Yes, Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
