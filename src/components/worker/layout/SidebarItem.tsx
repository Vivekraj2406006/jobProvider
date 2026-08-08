"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
interface SidebarItemProps {
  title: string;
  href: string;
  icon: LucideIcon;
}
export default function SidebarItem({title,href,icon: Icon,}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/worker" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{title}</span>
    </Link>
  );
}
