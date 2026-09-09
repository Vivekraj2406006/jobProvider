"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  calculateDistanceKm,
  calculateEtaMinutes,
  formatDistanceKm,
  formatEtaMinutes,
} from "@/utils/distance";

interface CustomerLiveTrackingMapProps {
  latitude: number;
  longitude: number;
  customerLatitude?: number | null;
  customerLongitude?: number | null;
}

const workerIcon = L.divIcon({
  className: "",
  html: `
    <div
      style="
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: #111827;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        font-size: 20px;
      "
    >
      🧑‍🔧
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

const customerIcon = L.divIcon({
  className: "",
  html: `
    <div
      style="
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: #ef4444;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        font-size: 18px;
      "
    >
      📍
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

function MapUpdater({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom(), {
      animate: true,
    });
  }, [latitude, longitude, map]);

  return null;
}

export default function CustomerLiveTrackingMap({
  latitude,
  longitude,
  customerLatitude,
  customerLongitude,
}: CustomerLiveTrackingMapProps) {
  const hasCustomerLocation =
    typeof customerLatitude === "number" &&
    typeof customerLongitude === "number";

  const distanceKm = hasCustomerLocation
    ? calculateDistanceKm(
        {
          latitude,
          longitude,
        },
        {
          latitude: customerLatitude,
          longitude: customerLongitude,
        },
      )
    : null;

  const etaMinutes =
    distanceKm !== null
      ? calculateEtaMinutes(distanceKm)
      : null;

  return (
    <div className="relative z-0 isolate overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Track your worker
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Worker location is updated automatically.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Live
          </div>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={false}
        className="h-[360px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater
          latitude={latitude}
          longitude={longitude}
        />

        {/* Worker marker */}
        <Marker
          position={[latitude, longitude]}
          icon={workerIcon}
        >
          <Popup>
            Worker is here
          </Popup>
        </Marker>

        {/* Customer marker */}
        {hasCustomerLocation && (
          <Marker
            position={[
              customerLatitude,
              customerLongitude,
            ]}
            icon={customerIcon}
          >
            <Popup>
              Your service location
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Distance / ETA / Legend */}
      <div className="border-t border-gray-100 px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Distance */}
          <div className="rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Distance
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
              {distanceKm !== null
                ? formatDistanceKm(distanceKm)
                : "Unavailable"}
            </p>
          </div>

          {/* ETA */}
          <div className="rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Estimated arrival
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
              {etaMinutes !== null
                ? formatEtaMinutes(etaMinutes)
                : "Unavailable"}
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-base">
                🧑‍🔧
              </span>
              Worker
            </div>

            {hasCustomerLocation && (
              <div className="flex items-center gap-2">
                <span className="text-base">
                  📍
                </span>
                Your location
              </div>
            )}
          </div>
        </div>

        {/* ETA note */}
        <p className="mt-3 text-xs leading-5 text-gray-400">
          ETA is an approximate estimate based on the worker&apos;s
          current location and average travel speed.
        </p>
      </div>
    </div>
  );
}
