"use client";

import { MapPin } from "lucide-react";

interface Props {
  area: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
}

export default function LocationCard({ area, city, state, pincode }: Props) {
  const addressItems = [
    { label: "Local Area / Street", value: area },
    { label: "City / District", value: city },
    { label: "State / Region", value: state },
    { label: "ZIP Pincode", value: pincode },
  ];

  return (
    <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
      <h2 className="text-lg font-bold text-gray-900">Service Coverage Location</h2>
      <p className="text-xs text-gray-400 mt-0.5 mb-6">Assigned service territory details</p>

      <div className="flex gap-4 items-start border-b border-gray-50 pb-4 mb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
          <MapPin size={20} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-800">Primary Location Base</h3>
          <p className="text-xs text-gray-500 mt-0.5">Matching bookings within a 15km radius of this address.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {addressItems.map((item) => (
          <div key={item.label} className="rounded-2xl border border-gray-50 p-4 bg-gray-50/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              {item.label}
            </span>
            <p className="mt-1 text-sm font-semibold text-gray-800">
              {item.value || "Not configured"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
