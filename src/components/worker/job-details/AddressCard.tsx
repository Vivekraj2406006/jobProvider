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
    alert("Address copied.");
  }

  function openMaps() {
    if (location.latitude == null || location.longitude == null) {
      alert("Location unavailable.");
      return;
    }

    window.open(
      `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
      "_blank",
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-red-100 p-3">
          <MapPin className="text-red-600" size={20} />
        </div>

        <h2 className="text-xl font-semibold">Customer Address</h2>
      </div>

      <div className="space-y-2">
        <p>{address.area || "-"}</p>

        <p>{address.city || "-"}</p>

        <p>{address.state || "-"}</p>

        <p>{address.pincode || "-"}</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          onClick={openMaps}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          <Navigation size={18} />
          Open in Maps
        </button>

        <button
          onClick={copyAddress}
          className="flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-medium hover:bg-gray-100"
        >
          <Copy size={18} />
          Copy Address
        </button>
      </div>
    </div>
  );
}
