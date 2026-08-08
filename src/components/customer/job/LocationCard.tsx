"use client";

import { ExternalLink, MapPin } from "lucide-react";

interface LocationCardProps {
  latitude: number | null;
  longitude: number | null;
  address?: {
    state?: string | null;
    city?: string | null;
    area?: string | null;
    pincode?: string | null;
  };
}

export default function LocationCard({
  latitude,
  longitude,
  address,
}: LocationCardProps) {
  if (latitude == null || longitude == null) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Service Location
        </h2>

        <div className="flex items-center gap-3 text-gray-500">
          <MapPin size={20} />
          <span>Location not available</span>
        </div>
      </div>
    );
  }

  const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  const addressText = [
    address?.area,
    address?.city,
    address?.state,
    address?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Service Location
        </h2>

        <MapPin className="text-blue-600" />
      </div>

      <div className="space-y-4">
        {addressText && (
          <p className="text-gray-600">
            {addressText}
          </p>
        )}

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Coordinates
          </p>

          <p className="mt-1 font-medium">
            {latitude}, {longitude}
          </p>
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          <MapPin size={18} />
          Open in Google Maps
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
