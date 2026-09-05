"use client";

import {
  CheckCircle2,
  Clock3,
  MapPin,
  Navigation,
  PlayCircle,
  UserCheck,
} from "lucide-react";

import type { BookingStatus } from "@/types/customerBooking";

interface BookingStatusTimelineProps {
  status: BookingStatus;
}

const steps: Array<{
  status: BookingStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    status: "PENDING",
    label: "Finding a worker",
    icon: Clock3,
  },
  {
    status: "ASSIGNED",
    label: "Worker assigned",
    icon: UserCheck,
  },
  {
    status: "ACCEPTED",
    label: "Worker accepted",
    icon: CheckCircle2,
  },
  {
    status: "ON_THE_WAY",
    label: "Worker is on the way",
    icon: Navigation,
  },
  {
    status: "ARRIVED",
    label: "Worker arrived",
    icon: MapPin,
  },
  {
    status: "IN_PROGRESS",
    label: "Service in progress",
    icon: PlayCircle,
  },
  {
    status: "COMPLETED",
    label: "Service completed",
    icon: CheckCircle2,
  },
];

const statusOrder: BookingStatus[] = [
  "PENDING",
  "ASSIGNED",
  "ACCEPTED",
  "ON_THE_WAY",
  "ARRIVED",
  "IN_PROGRESS",
  "COMPLETED",
];

export default function BookingStatusTimeline({
  status,
}: BookingStatusTimelineProps) {
  const currentIndex = statusOrder.indexOf(status);

  const terminalStatus =
    status === "CANCELLED" || status === "REJECTED";

  if (terminalStatus) {
    return (
      <div className="rounded-2xl border border-[#eadada] bg-[#fff7f7] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Clock3 className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-semibold text-[#382020]">
              Booking {status.toLowerCase()}
            </h3>

            <p className="mt-1 text-sm text-[#795c5c]">
              This booking is no longer active.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#e4ebe7] bg-white p-5 sm:p-6">
      <h2 className="text-lg font-bold text-[#10201b]">
        Booking progress
      </h2>

      <div className="mt-6">
        {steps.map((step, index) => {
          const Icon = step.icon;

          const completed =
            currentIndex >= index;

          const active =
            currentIndex === index;

          return (
            <div
              key={step.status}
              className="relative flex gap-4"
            >
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-5 top-10 h-[calc(100%-2px)] w-px ${
                    currentIndex > index
                      ? "bg-[#146356]"
                      : "bg-[#dce5e0]"
                  }`}
                />
              )}

              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                  completed
                    ? "border-[#146356] bg-[#146356] text-white"
                    : "border-[#d7e1dc] bg-white text-[#9aa9a2]"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="pb-7">
                <p
                  className={`text-sm font-semibold ${
                    active
                      ? "text-[#146356]"
                      : completed
                        ? "text-[#273730]"
                        : "text-[#8a9892]"
                  }`}
                >
                  {step.label}
                </p>

                {active && (
                  <p className="mt-1 text-xs text-[#71817b]">
                    Current booking status
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
