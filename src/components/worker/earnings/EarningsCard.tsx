import { LucideIcon } from "lucide-react";

interface EarningsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
}

export default function EarningsCard({
  title,
  value,
  icon: Icon,
  iconColor,
}: EarningsCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">{value}</h2>
        </div>

        <div className={`rounded-xl p-3 ${iconColor}`}>
          <Icon size={28} className="text-white" />
        </div>
      </div>
    </div>
  );
}
