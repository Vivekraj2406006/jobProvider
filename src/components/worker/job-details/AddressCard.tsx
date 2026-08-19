"use client";

import { MapPin, Navigation, Copy } from "lucide-react";

interface AddressCardProps {
  address: {
    area: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
  };
  location: {
    latitude: number | null;
    longitude: number | null;
  };
}

export default function AddressCard({ address, location }: AddressCardProps) {
  const fullAddress = [
    address.area,
    address.city,
    address.state,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  function copyAddress() {
    navigator.clipboard.writeText(fullAddress);
    alert("Address copied to clipboard.");
  }

  function openMaps() {
    if (location.latitude == null || location.longitude == null) {
      alert("Coordinates unavailable for navigation.");
      return;
    }
    window.open(
      `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
      "_blank",
    );
  }

  return (
    <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
          <MapPin size={18} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Physical Address</h2>
          <p className="text-xs text-gray-400 mt-0.5">Service delivery destination</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-50 bg-gray-50/20 p-5 space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Street / Area</span>
            <p className="mt-1 text-sm font-semibold text-gray-800">{address.area || "-"}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">City / Town</span>
            <p className="mt-1 text-sm font-semibold text-gray-800">{address.city || "-"}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">State / Region</span>
            <p className="mt-1 text-sm font-semibold text-gray-800">{address.state || "-"}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">ZIP Pincode</span>
            <p className="mt-1 text-sm font-semibold text-gray-800">{address.pincode || "-"}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={openMaps}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-[#c8a56a] hover:bg-[#b08e54] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm shadow-amber-500/10"
        >
          <Navigation size={14} />
          Navigate in Maps
        </button>

        <button
          onClick={copyAddress}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm"
        >
          <Copy size={14} />
          Copy Address
        </button>
      </div>
    </div>
  );
}
