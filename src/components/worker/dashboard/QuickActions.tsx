import Link from "next/link";
import { BriefcaseBusiness, MapPin, Power } from "lucide-react";

const actions = [
  {
    title: "View Jobs",
    href: "/worker/jobs",
    icon: BriefcaseBusiness,
    color: "bg-blue-600",
  },
  {
    title: "Update Location",
    href: "/worker/profile",
    icon: MapPin,
    color: "bg-orange-500",
  },
  {
    title: "Go Offline",
    href: "#",
    icon: Power,
    color: "bg-green-600",
  },
];

export default function QuickActions() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Quick Actions
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="flex items-center gap-4 rounded-xl border border-gray-200 p-5 transition hover:border-blue-300 hover:shadow-md"
            >
              <div className={`rounded-xl p-3 ${action.color}`}>
                <Icon className="text-white" size={22} />
              </div>

              <span className="font-semibold text-gray-800">
                {action.title}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
