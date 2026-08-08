import { CheckCircle2, XCircle } from "lucide-react";

interface Props {
  available: boolean;
}

export default function AvailabilityCard({ available }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Availability</h2>

      <div
        className={`flex items-center gap-3 rounded-xl p-4 ${
          available ? "bg-green-50" : "bg-red-50"
        }`}
      >
        {available ? (
          <>
            <CheckCircle2 className="text-green-600" size={24} />

            <div>
              <p className="font-semibold text-green-700">Available</p>

              <p className="text-sm text-green-600">Ready to accept jobs.</p>
            </div>
          </>
        ) : (
          <>
            <XCircle className="text-red-600" size={24} />

            <div>
              <p className="font-semibold text-red-700">Offline</p>

              <p className="text-sm text-red-600">Not accepting jobs.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
