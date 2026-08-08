"use client";

import { useState } from "react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
}

interface Props {
  service: Service;
  onClose: () => void;
}

export default function BookServiceModal({ service, onClose }: Props) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [latitude, setLatitude] = useState<number | null>(null);

  const [longitude, setLongitude] = useState<number | null>(null);

  const [locationLoading, setLocationLoading] = useState(false);

  const [locationFound, setLocationFound] = useState(false);

  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center">
          <div className="mb-4 text-6xl">✅</div>

          <h2 className="text-2xl font-bold">Booking Created</h2>

          <p className="mt-2 text-gray-600">
            A nearby worker will be assigned shortly.
          </p>

          <button
            onClick={onClose}
            className="mt-6 rounded-lg bg-black px-6 py-3 text-white"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        setLocationFound(true);
        setLocationLoading(false);
      },
      (error) => {
        console.error(error);

        alert("Unable to fetch location. Please allow location permission.");

        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleBooking = async () => {
    try {
      if (!description.trim()) {
        alert("Please enter a description");
        return;
      }

      if (latitude === null || longitude === null) {
        alert("Please capture your location");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      setLoading(true);

      const response = await fetch("/api/jobs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: service.id,
          description: description.trim(),
          latitude,
          longitude,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      setSuccess(true);

      setDescription("");
      setLatitude(null);
      setLongitude(null);
      setLocationFound(false);

    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{service.name}</h2>

          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-600 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Service Details */}
        <p className="mb-4 text-gray-600">
          {service.description || "No description available"}
        </p>

        <p className="mb-6 text-lg font-bold text-green-600">
          ₹{service.price}
        </p>

        {/* Description */}
        <div>
          <label className="mb-2 block font-medium">Describe Your Issue</label>

          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Example: Washing machine is not starting..."
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Location Button */}
        <button
          onClick={getLocation}
          disabled={locationLoading}
          className="mt-4 w-full rounded-lg border py-3 font-medium transition hover:bg-gray-100 disabled:opacity-50"
        >
          {locationLoading ? "Getting Location..." : "Use Current Location"}
        </button>

        {/* Location Preview */}
        {locationFound && (
          <div className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            <p className="font-semibold">✓ Location Captured Successfully</p>

            <p className="mt-2">Latitude: {latitude?.toFixed(6)}</p>

            <p>Longitude: {longitude?.toFixed(6)}</p>
          </div>
        )}

        {/* Book Button */}
        <button
          onClick={handleBooking}
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-black py-3 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Booking Service..." : "Book Service"}
        </button>
      </div>
    </div>
  );
}
