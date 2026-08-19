"use client";

import Link from "next/link";
import { BriefcaseBusiness, User, Wallet } from "lucide-react";

const actions = [
  {
    title: "Browse Assigned Jobs",
    subtitle: "Manage details, timelines & statuses",
    href: "/worker/jobs",
    icon: BriefcaseBusiness,
    bgColor: "bg-blue-50 border border-blue-100",
    iconColor: "text-blue-600",
    hoverBorder: "hover:border-blue-300",
  },
  {
    title: "Update Coverage",
    subtitle: "Modify profile skills & address details",
    href: "/worker/profile",
    icon: User,
    bgColor: "bg-amber-50 border border-amber-100",
    iconColor: "text-amber-600",
    hoverBorder: "hover:border-amber-300",
  },
  {
    title: "Earnings Dashboard",
    subtitle: "Track completed payouts & dates",
    href: "/worker/earnings",
    icon: Wallet,
    bgColor: "bg-emerald-50 border border-emerald-100",
    iconColor: "text-emerald-600",
    hoverBorder: "hover:border-emerald-300",
  },
];

export default function QuickActions() {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
      <p className="text-xs text-gray-400 mt-0.5 mb-6">Frequently used dashboard shortcuts</p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className={`group flex items-start gap-4 rounded-2xl border border-gray-50 p-5 transition-all duration-300 hover:bg-gray-50/50 hover:shadow-sm ${action.hoverBorder}`}
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                <Icon className={action.iconColor} size={20} />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-bold text-gray-800 transition-colors group-hover:text-gray-900">
                  {action.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {action.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
