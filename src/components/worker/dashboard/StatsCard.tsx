import { LucideIcon } from "lucide-react";
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor: string;
}

export default function StatsCard({title,value,icon: Icon,iconBgColor,}: StatsCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900">{value}</h2>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${iconBgColor}`}
        >
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
    </div>
  );
}
