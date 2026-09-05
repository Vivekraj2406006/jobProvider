"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import {
  Search,
  LogOut,
  UserPlus,
  BriefcaseBusiness,
  Menu,
  Home,
  User,
  Hammer,
  Briefcase,
  Bell,
  Settings,
  MessageCircle,
  X,
  ChevronRight,
  CalendarCheck
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Auth State Sync
  useEffect(() => {
    const updateAuthState = () => {
      const token = localStorage.getItem("token");

      setIsLoggedIn(!!token);
    };

    updateAuthState();

    window.addEventListener("storage", updateAuthState);

    window.addEventListener("auth-change", updateAuthState);

    return () => {
      window.removeEventListener("storage", updateAuthState);

      window.removeEventListener("auth-change", updateAuthState);
    };
  }, []);

  // Close Menu On Outside Click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("auth-change"));

    setMenuOpen(false);

    router.replace("/login");
  };

  const navLinks = isLoggedIn
    ? [
        {
          href: "/dashboard/customer",
          icon: Home,
          label: "Dashboard",
        },
        {
          href: "/dashboard/customer/jobs",
          icon: Briefcase,
          label: "My Jobs",
        },
        {
          href: "/dashboard/customer/bookings",
          label: "My Bookings",
          icon: CalendarCheck,
        },
        {
          href: "/workers/create",
          icon: Hammer,
          label: "Become Worker",
        },
        {
          href: "/worker",
          icon: BriefcaseBusiness,
          label: "Worker Dashboard",
        },
        {
          href: "/messages",
          icon: MessageCircle,
          label: "Messages",
        },
        {
          href: "/notifications",
          icon: Bell,
          label: "Notifications",
        },
        {
          href: "/profile",
          icon: User,
          label: "Profile",
        },
        {
          href: "/settings",
          icon: Settings,
          label: "Settings",
        },
      ]
    : [
        {
          href: "/",
          icon: Home,
          label: "Home",
        },
      ];
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[#C8A56A]/15 bg-[#FFFDF9]/82 backdrop-blur-xl saturate-180 shadow-[0_1px_40px_rgba(100,80,40,0.06)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200 ${
                menuOpen
                  ? "border-[#C8A56A]/50 bg-[#F4E8D6] text-[#A07840]"
                  : "border-transparent text-[#6B5D4D] hover:border-[#C8A56A]/30 hover:bg-[#F7F2EB] hover:text-[#3D2B1F]"
              }`}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}

              <span className="hidden sm:inline">
                {menuOpen ? "Close" : "Menu"}
              </span>
            </button>

            {menuOpen && (
              <div className="absolute left-0 top-[54px] w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#E7DED2]/90 bg-[#FFFEFB] shadow-[0_4px_6px_-1px_rgba(100,80,40,0.04),0_20px_60px_-10px_rgba(100,80,40,0.14)]">
                <div className="border-b border-[#E7DED2]/60 px-5 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#B5A494]">
                    Navigation
                  </p>
                </div>

                <div className="py-2">
                  {navLinks.map(({ href, icon: Icon, label }) => (
                    <Link
                      key={href + label}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-[#4A3F35] transition-all hover:bg-[#F7F2EB] hover:pl-6"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C8A56A]/10 text-[#A07840]">
                        <Icon size={15} />
                      </span>

                      <span>{label}</span>

                      <ChevronRight
                        size={14}
                        className="ml-auto text-[#C8A56A] opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </Link>
                  ))}
                </div>

                {isLoggedIn && (
                  <>
                    <div className="my-1 h-px bg-[#E7DED2]/60" />

                    <div className="pb-2 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-5 py-2.5 text-sm font-medium text-[#C0392B] transition-all hover:bg-red-50 hover:pl-6"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                          <LogOut size={15} />
                        </span>

                        <span>Sign out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#C8A56A] to-[#A07840] text-white shadow-[0_2px_12px_rgba(200,165,106,0.45)]">
              <BriefcaseBusiness size={16} />
            </div>

            <span className="text-[1.2rem] font-extrabold tracking-[-0.03em] text-gray-900">
              SkillLink
            </span>
          </Link>
        </div>

        {/* Search */}
        <div className="hidden flex-1 px-10 md:block md:max-w-sm">
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B5A494]"
            />

            <input
              type="text"
              placeholder="Search jobs, skills..."
              className="h-10 w-full rounded-full border border-[#E7DED2]/70 bg-[#F7F2EB]/70 pl-10 pr-4 text-sm text-gray-800 outline-none transition-all focus:border-[#C8A56A] focus:bg-white"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-[#6B5D4D] transition-all hover:bg-[#F7F2EB]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-[#C8A56A] to-[#A07840] px-4 py-2 text-sm font-semibold text-white"
              >
                <UserPlus size={15} />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-[#E7DED2]/90 px-3.5 py-2 text-sm font-medium text-[#6B5D4D] transition-all hover:border-red-500/30 hover:bg-red-50 hover:text-[#C0392B]"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
