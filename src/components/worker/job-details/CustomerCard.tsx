"use client";

import { Mail, User } from "lucide-react";

interface CustomerCardProps {
  customer: {
    name: string;
    email: string;
  };
}

export default function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
      <h2 className="text-lg font-bold text-gray-900">Customer Details</h2>
      <p className="text-xs text-gray-400 mt-0.5 mb-6">Contact info for this booking</p>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <User size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Customer Name</p>
            <p className="text-sm font-semibold text-gray-800">{customer.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Mail size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email Address</p>
            <p className="text-sm font-semibold text-gray-800 break-all">{customer.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
