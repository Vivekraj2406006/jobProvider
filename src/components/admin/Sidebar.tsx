"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  ClipboardList,
  Settings,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Workers",
    href: "/admin/workers",
    icon: BriefcaseBusiness,
  },
  {
    name: "Jobs",
    href: "/admin/jobs",
    icon: ClipboardList,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white border-r">
      <div className="border-b p-6">
        <h1 className="text-2xl font-bold">
          SkillLink Admin
        </h1>
      </div>

      <nav className="p-4">
        {links.map((link) => {
          const Icon = link.icon;

          const active =
            pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`mb-2 flex items-center gap-3 rounded-xl p-3 transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <Icon size={20} />

              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
