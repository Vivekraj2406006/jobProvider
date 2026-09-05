"use client";

import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  UserRound,
} from "lucide-react";

import type { CustomerBooking } from "@/types/customerBooking";

interface CustomerBookingCardProps {
  booking: CustomerBooking;
}

function getStatusClasses(status: CustomerBooking["status"]) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "ASSIGNED":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "ACCEPTED":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";

    case "ON_THE_WAY":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";

    case "ARRIVED":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "IN_PROGRESS":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "CANCELLED":
      return "bg-slate-50 text-slate-600 border-slate-200";

    case "REJECTED":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function getStatusLabel(status: CustomerBooking["status"]) {
  switch (status) {
    case "ON_THE_WAY":
      return "On the way";

    case "IN_PROGRESS":
      return "In progress";

    case "PENDING":
      return "Finding a worker";

    default:
      return status
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeStyle: "short",
  }).format(new Date(value));
}

export default function CustomerBookingCard({
  booking,
}: CustomerBookingCardProps) {
  return (
    <Link
      href={`/dashboard/customer/bookings/${booking.id}`}
      className="group block rounded-2xl border border-[#e5ebe7] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#cddbd4] hover:shadow-md"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7a8982]">
              {booking.service.category || "Service"}
            </p>

            <h3 className="mt-1 truncate text-lg font-bold text-[#10201b]">
              {booking.service.name}
            </h3>

            <p className="mt-1 text-sm text-[#71817b]">
              {booking.package.name}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
              booking.status,
            )}`}
          >
            {getStatusLabel(booking.status)}
          </span>
        </div>

        <div className="grid gap-3 text-sm text-[#53645d] sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#146356]" />
            <div>
              <p className="font-medium text-[#273730]">Date</p>
              <p>{formatDate(booking.scheduledDate)}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#146356]" />
            <div>
              <p className="font-medium text-[#273730]">Time</p>
              <p>
                {formatTime(booking.startTime)} -{" "}
                {formatTime(booking.endTime)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 border-t border-[#edf1ef] pt-4">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#146356]" />

          <div className="min-w-0 flex-1">
            <p className="font-medium text-[#273730]">
              {booking.address.label}
            </p>

            <p className="mt-0.5 truncate text-sm text-[#71817b]">
              {booking.address.addressLine}
              {booking.address.area
                ? `, ${booking.address.area}`
                : ""}
              {`, ${booking.address.city}`}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#edf1ef] pt-4">
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-[#146356]" />

            {booking.worker ? (
              <div>
                <p className="text-xs text-[#7a8982]">Worker</p>
                <p className="text-sm font-semibold text-[#273730]">
                  {booking.worker.user.name}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-[#71817b]">
                  Worker not assigned yet
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm font-semibold text-[#146356]">
            <span>
              ₹{booking.totalAmount.toLocaleString("en-IN")}
            </span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
