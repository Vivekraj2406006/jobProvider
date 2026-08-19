"use client";

import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  cardBorderHover: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  cardBorderHover,
}: StatsCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-${cardBorderHover} hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.06)]`}
    >
      {/* Dynamic light gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-center justify-between">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {title}
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBgColor} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
