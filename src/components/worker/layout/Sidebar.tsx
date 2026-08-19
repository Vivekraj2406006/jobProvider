"use client";
import Link from "next/link";
import { workerNavigation } from "@/lib/worker/navigation";
import SidebarItem from "./SidebarItem";
export default function Sidebar() {
  return (
    <aside className="hidden md:flex h-full w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="border-b border-gray-200 p-6">
        <Link href="/worker">
          <h1 className="text-2xl font-bold text-blue-600">SkillLink</h1>
          <p className="text-sm text-gray-500">Worker Panel</p>
        </Link>
      </div>
      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {workerNavigation.map((item) => (
          <SidebarItem key={item.href} {...item} />
        ))}
      </nav>
      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <p className="text-xs text-gray-400">SkillLink v1.0</p>
      </div>
    </aside>
  );
}
