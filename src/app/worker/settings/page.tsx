"use client";

import Link from "next/link";
import {
  User,
  Wrench,
  CalendarDays,
  ChevronRight,
  Settings,
} from "lucide-react";

const settingsItems = [
  {
    title: "Profile",
    description: "Manage your name, contact details, location and bio.",
    href: "/worker/settings/profile",
    icon: User,
  },
  {
    title: "Skills & Services",
    description: "Manage the services and skills you offer to customers.",
    href: "/worker/settings/skills",
    icon: Wrench,
  },
  {
    title: "Availability",
    description: "Set your working days, hours and job availability.",
    href: "/worker/settings/availability",
    icon: CalendarDays,
  },
];

export default function WorkerSettingsPage() {
  return (
    <div className="min-h-screen bg-[#f3f7f5] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#146356] text-white">
              <Settings size={20} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#10201b]">
                Settings
              </h1>

              <p className="text-sm text-[#5c6d66]">
                Manage your worker account and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Settings Cards */}
        <div className="space-y-4">
          {settingsItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group block rounded-2xl border border-[#dfe8e3] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#1e8f7a] hover:shadow-md sm:p-6"
              >
                <div className="flex items-center gap-4">

                  {/* Icon */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf3ef] text-[#146356]">
                    <Icon size={22} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold text-[#10201b]">
                      {item.title}
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-[#5c6d66]">
                      {item.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    size={20}
                    className="shrink-0 text-[#93a39c] transition group-hover:translate-x-1 group-hover:text-[#146356]"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Account Status */}
        <div className="mt-8 rounded-2xl border border-[#dfe8e3] bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-[#10201b]">
            Account status
          </h2>

          <div className="mt-4 flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1e8f7a]" />

            <div>
              <p className="text-sm font-medium text-[#10201b]">
                Worker account active
              </p>

              <p className="text-xs text-[#5c6d66]">
                Your account is ready to receive jobs.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
