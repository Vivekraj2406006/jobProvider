import { MapPin } from "lucide-react";

interface Props {
  area: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
}

export default function LocationCard({ area, city, state, pincode }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Location</h2>

      <div className="flex gap-3">
        <MapPin className="mt-1 text-blue-600" size={20} />

        <div className="space-y-1">
          <p>{area || "Not Added"}</p>

          <p>{city || "Not Added"}</p>

          <p>{state || "Not Added"}</p>

          <p>{pincode || "Not Added"}</p>
        </div>
      </div>
    </div>
  );
}
