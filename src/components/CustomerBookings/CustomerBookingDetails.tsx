"use client";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Phone,
  Receipt,
  UserRound,
} from "lucide-react";

import BookingStatusTimeline from "@/components/CustomerBookings/BookingStatusTimeline";

import type { CustomerBooking } from "@/types/customerBooking";

interface CustomerBookingDetailsProps {
  booking: CustomerBooking;
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

export default function CustomerBookingDetails({
  booking,
}: CustomerBookingDetailsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
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

        <BookingStatusTimeline status={booking.status} />

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
        </section>

        <section className="rounded-2xl border border-[#e4ebe7] bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-[#10201b]">
            Price details
          </h2>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-[#71817b]">Base price</span>
              <span className="font-medium text-[#273730]">
                ₹{booking.basePrice.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-[#71817b]">Platform fee</span>
              <span className="font-medium text-[#273730]">
                ₹{booking.platformFee.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-[#71817b]">Discount</span>
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
                  <p className="text-xs text-[#7a8982]">Rating</p>
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
        </section>
      </aside>
    </div>
  );
}
