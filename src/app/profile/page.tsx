"use client";

import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlertCircle,
  Briefcase,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  Star,
  UserCircle2,
} from "lucide-react";

interface Worker {
  skill: string[];
  experience: number;
  bio: string | null;
  phone: string | null;
  profileImage: string | null;

  rating: number;
  completedJobs: number;

  isAvailable: boolean;

  state: string | null;
  city: string | null;
  area: string | null;
  pincode: string | null;

  latitude: number | null;
  longitude: number | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  worker: Worker | null;
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in to continue.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        setError(response.data?.message || "Failed to load profile");
      }
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 401) {
          setError("Your session has expired. Please log in again.");
          return;
        }

        setError(error.response?.data?.message || "Failed to load profile");
      } else {
        setError("Something went wrong while loading your profile");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const initials = useMemo(() => {
    if (!user?.name) return "U";

    return user.name
      .split(" ")
      .map((namePart) => namePart[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [user?.name]);

  const location = useMemo(() => {
    if (!user?.worker) return "Location not provided";

    const parts = [
      user.worker.area,
      user.worker.city,
      user.worker.state,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : "Location not provided";
  }, [user?.worker]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse pb-12">
        <div className="h-64 rounded-3xl bg-gray-200" />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="h-36 rounded-3xl bg-gray-200" />
            <div className="h-52 rounded-3xl bg-gray-200" />
          </div>

          <div className="space-y-8">
            <div className="h-40 rounded-3xl bg-gray-200" />
            <div className="h-48 rounded-3xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-600">
          <AlertCircle size={28} />
        </div>

        <h2 className="text-xl font-bold text-gray-900">
          Failed to load Profile
        </h2>

        <p className="mt-2 max-w-sm text-sm text-gray-500">{error}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={loadProfile}
            className="flex items-center gap-2 rounded-xl bg-[#c8a56a] px-5 py-3 font-semibold text-white transition hover:bg-[#b08e54]"
          >
            <RefreshCw size={16} />
            Try Again
          </button>

          <button
            onClick={() => router.push("/login")}
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gray-150 bg-gray-50 text-gray-400">
          <UserCircle2 size={28} />
        </div>

        <h2 className="text-xl font-bold text-gray-900">Profile Not Found</h2>

        <p className="mt-2 max-w-sm text-sm text-gray-500">
          We could not locate your profile details for this account.
        </p>

        <button
          onClick={loadProfile}
          className="mt-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Check Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your account details, contact information, and activity
            snapshot.
          </p>
        </div>

        <button
          onClick={loadProfile}
          className="self-start flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
        >
          <RefreshCw size={14} className="text-gray-500" />
          Sync Profile
        </button>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-[#182b26] to-[#214239] p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            {user.worker?.profileImage ? (
              <Image
                src={user.worker.profileImage}
                alt={user.name}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#e8a23a] text-2xl font-bold text-[#2b1a05]">
                {initials}
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>

              <p className="mt-1 text-sm text-gray-300">{user.email}</p>

              <span className="mt-3 inline-flex rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300">
                {user.role}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white">
            {user.worker?.isAvailable
              ? "Available for Work"
              : "Customer Account"}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#10201b]">
              Personal Information
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <InfoRow icon={Mail} label="Email" value={user.email} />

              <InfoRow
                icon={Phone}
                label="Phone"
                value={user.worker?.phone || "Not provided"}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#10201b]">About</h3>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {user.worker?.bio ||
                "This account has no professional bio yet. Add profile details to improve visibility and trust."}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#10201b]">Location</h3>

            <div className="mt-4 flex items-start gap-3 rounded-xl bg-[#f3f7f5] p-4">
              <MapPin size={18} className="mt-0.5 shrink-0 text-[#146356]" />

              <div>
                <p className="text-sm font-semibold text-[#10201b]">
                  Saved Address
                </p>

                <p className="mt-1 text-sm text-gray-500">{location}</p>

                {user.worker?.pincode && (
                  <p className="mt-1 text-xs text-gray-500">
                    PIN: {user.worker.pincode}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#10201b]">Account Status</h3>

            <div className="mt-4 flex items-center gap-3">
              <ShieldCheck size={18} className="text-[#146356]" />
              <p className="text-sm font-medium text-gray-700">
                Profile is active
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#10201b]">
              Activity Snapshot
            </h3>

            <div className="mt-4 space-y-3">
              <StatRow
                icon={Star}
                label="Rating"
                value={String(user.worker?.rating ?? 0)}
              />

              <StatRow
                icon={Briefcase}
                label="Jobs Completed"
                value={String(user.worker?.completedJobs ?? 0)}
              />

              <StatRow
                icon={Briefcase}
                label="Experience"
                value={`${user.worker?.experience ?? 0} years`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 px-4 py-3">
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        <Icon size={14} className="text-[#146356]" />
        {label}
      </div>

      <p className="text-sm font-medium text-[#10201b]">{value}</p>
    </div>
  );
}

function StatRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Icon size={15} className="text-[#146356]" />
        {label}
      </div>

      <span className="text-sm font-semibold text-[#10201b]">{value}</span>
    </div>
  );
}
