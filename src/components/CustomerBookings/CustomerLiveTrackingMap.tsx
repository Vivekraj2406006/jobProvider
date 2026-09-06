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

  return (
    <div className="relative z-0 isolate overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
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

        <MapUpdater latitude={latitude} longitude={longitude} />

        <Marker position={[latitude, longitude]} icon={workerIcon}>
          <Popup>Worker is here</Popup>
        </Marker>

        {hasCustomerLocation && (
          <Marker
            position={[
              customerLatitude as number,
              customerLongitude as number,
            ]}
            icon={customerIcon}
          >
            <Popup>Your service location</Popup>
          </Marker>
        )}
      </MapContainer>

      <div className="flex flex-wrap gap-4 border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="text-base">🧑‍🔧</span>
          Worker
        </div>

        {hasCustomerLocation && (
          <div className="flex items-center gap-2">
            <span className="text-base">📍</span>
            Your location
          </div>
        )}
      </div>
    </div>
  );
}
