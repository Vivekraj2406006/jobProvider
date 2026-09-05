"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  Play,
  User,
  XCircle,
} from "lucide-react";

import {
  useWorkerBooking,
  useWorkerBookingActions,
} from "@/hooks/useWorkerBookings";

import {
  getBookingActionLabel,
  getBookingStatusLabel,
} from "@/utils/bookingStatus";

import type { BookingAction } from "@/types/workerBooking";

interface WorkerBookingDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatTime(date: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

function getStatusClasses(status: string) {
  switch (status) {
    case "ASSIGNED":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "ACCEPTED":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "ON_THE_WAY":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";

    case "ARRIVED":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "IN_PROGRESS":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "COMPLETED":
      return "bg-green-50 text-green-700 border-green-200";

    case "CANCELLED":
    case "REJECTED":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function getActionIcon(action: BookingAction) {
  switch (action) {
    case "accept":
      return <CheckCircle2 className="h-4 w-4" />;

    case "reject":
      return <XCircle className="h-4 w-4" />;

    case "startJourney":
      return <Navigation className="h-4 w-4" />;

    case "markArrived":
      return <MapPin className="h-4 w-4" />;

    case "startWork":
      return <Play className="h-4 w-4" />;

    case "complete":
      return <CheckCircle2 className="h-4 w-4" />;

    default:
      return null;
  }
}

export default async function WorkerBookingDetailsPage({
  params,
}: WorkerBookingDetailsPageProps) {
  const { id } = await params;

  return <BookingDetails bookingId={id} />;
}

function BookingDetails({ bookingId }: { bookingId: string }) {
  const router = useRouter();

  const { booking, loading, error, refreshBooking } =
    useWorkerBooking(bookingId);

  const {
    performAction,
    loading: actionLoading,
    error: actionError,
  } = useWorkerBookingActions(bookingId);

  async function handleAction(action: BookingAction) {
    if (action === "reject") {
      const confirmed = window.confirm(
        "Are you sure you want to reject this booking?",
      );

      if (!confirmed) return;
    }

    try {
      await performAction(action);
      await refreshBooking();
    } catch {
      // Error is already handled by the hook.
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f7f5]">
        <div className="mx-auto flex min-h-[500px] max-w-5xl items-center justify-center px-4">
          <div className="flex items-center gap-3 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading booking...
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#f3f7f5]">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/worker/bookings"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to bookings
          </Link>

          <div className="rounded-2xl border border-red-200 bg-white p-10 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Unable to load booking
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {error || "Booking not found."}
            </p>

            <button
              onClick={refreshBooking}
              className="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canAccept = booking.status === "ASSIGNED";
  const canReject = booking.status === "ASSIGNED";

  const nextAction =
    booking.status === "ASSIGNED"
      ? "accept"
      : booking.status === "ACCEPTED"
        ? "startJourney"
        : booking.status === "ON_THE_WAY"
          ? "markArrived"
          : booking.status === "ARRIVED"
            ? "startWork"
            : booking.status === "IN_PROGRESS"
              ? "complete"
              : null;

  return (
    <div className="min-h-screen bg-[#f3f7f5]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/worker/bookings"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to bookings
        </Link>

        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {booking.service.category || "Service"}
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900">
                {booking.service.name}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {booking.package.name}
              </p>
            </div>

            <span
              className={`self-start rounded-full border px-4 py-2 text-sm font-medium ${getStatusClasses(
                booking.status,
              )}`}
            >
              {getBookingStatusLabel(booking.status)}
            </span>
          </div>

          {/* Schedule */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-gray-500">
                <CalendarDays className="h-4 w-4" />
                <span className="text-xs">Scheduled date</span>
              </div>

              <p className="mt-2 font-medium text-gray-900">
                {formatDate(booking.scheduledDate)}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-gray-500">
                <Clock3 className="h-4 w-4" />
                <span className="text-xs">Scheduled time</span>
              </div>

              <p className="mt-2 font-medium text-gray-900">
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Action error */}
        {actionError && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

            <p className="text-sm text-red-700">{actionError}</p>
          </div>
        )}

        {/* Customer */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Customer</h2>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <User className="h-6 w-6 text-gray-500" />
              </div>

              <div>
                <p className="font-medium text-gray-900">
                  {booking.customer.name}
                </p>

                <p className="text-sm text-gray-500">
                  {booking.customer.email}
                </p>
              </div>
            </div>

            <a
              href={`tel:${booking.address.phone}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Phone className="h-4 w-4" />
              Call customer
            </a>
          </div>
        </section>

        {/* Address */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Service location
          </h2>

          <div className="mt-5 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <MapPin className="h-5 w-5 text-gray-500" />
            </div>

            <div>
              <p className="font-medium text-gray-900">
                {booking.address.name}
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                {booking.address.addressLine}
                {booking.address.area ? `, ${booking.address.area}` : ""}
                {`, ${booking.address.city}, ${booking.address.state} - ${booking.address.pincode}`}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Phone: {booking.address.phone}
              </p>
            </div>
          </div>

          {booking.address.latitude !== null &&
            booking.address.longitude !== null && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${booking.address.latitude},${booking.address.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
              >
                <Navigation className="h-4 w-4" />
                Open in Maps
              </a>
            )}
        </section>

        {/* Package */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Service details
          </h2>

          <div className="mt-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">
                  {booking.package.name}
                </p>

                {booking.package.description && (
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {booking.package.description}
                  </p>
                )}
              </div>

              <span className="shrink-0 text-sm font-medium text-gray-900">
                {booking.package.durationMin} min
              </span>
            </div>
          </div>
        </section>

        {/* Notes */}
        {booking.notes && (
          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Customer notes
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {booking.notes}
            </p>
          </section>
        )}

        {/* Price */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Payment summary
          </h2>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Base price</span>

              <span className="font-medium text-gray-900">
                ₹{booking.basePrice.toLocaleString("en-IN")}
              </span>
            </div>

            {booking.platformFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Platform fee</span>

                <span className="font-medium text-gray-900">
                  ₹{booking.platformFee.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            {booking.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Discount</span>

                <span className="font-medium text-green-600">
                  -₹{booking.discount.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>

                <span className="text-lg font-bold text-gray-900">
                  ₹{booking.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        {(nextAction || canReject) && (
          <section className="sticky bottom-4 mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
            <div className="flex flex-col gap-3 sm:flex-row">
              {nextAction && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleAction(nextAction)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    getActionIcon(nextAction)
                  )}

                  {actionLoading
                    ? "Updating..."
                    : getBookingActionLabel(nextAction)}
                </button>
              )}

              {canReject && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleAction("reject")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <XCircle className="h-4 w-4" />
                  Reject Booking
                </button>
              )}
            </div>
          </section>
        )}

        {/* Completed */}
        {booking.status === "COMPLETED" && (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 p-5 text-sm font-medium text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            This booking has been completed successfully.
          </div>
        )}

        {/* Cancelled / rejected */}
        {(booking.status === "CANCELLED" || booking.status === "REJECTED") && (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
            <XCircle className="h-5 w-5" />
            This booking is{" "}
            {booking.status === "REJECTED" ? "rejected" : "cancelled"}.
          </div>
        )}
      </div>
    </div>
  );
}
