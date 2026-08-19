"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Sidebar from "./Sidebar";
import { workerNavigation } from "@/lib/worker/navigation";

interface WorkerLayoutProps {
  children: ReactNode;
}

export default function WorkerLayout({ children }: WorkerLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden md:flex-row">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Page Content Area */}
      <main className="h-full min-w-0 flex-1 overflow-y-auto bg-gray-50 p-4 pb-20 sm:p-6 md:pb-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-150 bg-white/95 px-2 py-2 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around">
          {workerNavigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/worker" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition-all duration-200 ${
                  isActive
                    ? "text-[#c8a56a]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "stroke-[2.5]" : "stroke-[2]"}
                />
                <span className="text-[10px] font-bold tracking-wide">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
