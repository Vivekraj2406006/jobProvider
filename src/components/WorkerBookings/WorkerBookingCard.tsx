"use client";

import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  User,
} from "lucide-react";

import type { WorkerBooking } from "@/types/workerBooking";
import { getBookingStatusLabel } from "@/utils/bookingStatus";

interface WorkerBookingCardProps {
  booking: WorkerBooking;
}

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
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

function getStatusClasses(status: WorkerBooking["status"]) {
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

    case "PENDING":
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export default function WorkerBookingCard({
  booking,
}: WorkerBookingCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {booking.service.category || "Service"}
          </p>

          <h3 className="mt-1 truncate text-lg font-semibold text-gray-900">
            {booking.service.name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {booking.package.name}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
            booking.status
          )}`}
        >
          {getBookingStatusLabel(booking.status)}
        </span>
      </div>

      {/* Customer */}
      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <User className="h-5 w-5 text-gray-500" />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900">
            {booking.customer.name}
          </p>

          <p className="text-xs text-gray-500">
            {booking.customer.email}
          </p>
        </div>
      </div>

      {/* Booking information */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />

          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="mt-0.5 text-sm font-medium text-gray-900">
              {formatDate(booking.scheduledDate)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />

          <div>
            <p className="text-xs text-gray-500">Time</p>
            <p className="mt-0.5 text-sm font-medium text-gray-900">
              {formatTime(booking.startTime)} -{" "}
              {formatTime(booking.endTime)}
            </p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="mt-3 flex items-start gap-3 rounded-xl bg-gray-50 p-3">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />

        <div className="min-w-0">
          <p className="text-xs text-gray-500">Location</p>

          <p className="mt-0.5 text-sm text-gray-900">
            {booking.address.addressLine}
            {booking.address.area
              ? `, ${booking.address.area}`
              : ""}
            {`, ${booking.address.city}, ${booking.address.state} - ${booking.address.pincode}`}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-500">Booking amount</p>

          <p className="mt-1 text-lg font-semibold text-gray-900">
            ₹{booking.totalAmount.toLocaleString("en-IN")}
          </p>
        </div>

        <Link
          href={`/worker/bookings/${booking.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          View details
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
