"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Star,
  Briefcase,
  CheckCircle,
  Phone,
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

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.replace("/login");
          return;
        }

        const response = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
      } catch (error) {
        console.error(error);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F5F0]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D8B67C] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F5F0] p-4">
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <p className="text-lg font-medium text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8F5F0] px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Hero Section */}

        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#D8B67C] to-[#C8A56A] p-8 text-white shadow-xl">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="flex flex-col items-center gap-5 md:flex-row">
              {user.worker?.profileImage ? (
                <Image
                  src={user.worker.profileImage}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white text-5xl font-bold text-[#C8A56A] shadow-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold">{user.name}</h1>

                <p className="mt-2 text-white/90">{user.email}</p>

                <span className="mt-4 inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">
                  {user.role}
                </span>
              </div>
            </div>

            {user.worker && (
              <div
                className={`rounded-full px-5 py-2 text-sm font-semibold ${
                  user.worker.isAvailable ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {user.worker.isAvailable ? "Available for Work" : "Unavailable"}
              </div>
            )}
          </div>
        </div>

        {/* Basic Information */}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">Basic Information</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>{user.email}</span>
              </div>

              {user.worker?.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={18} />
                  <span>{user.worker.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}

          {user.worker && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <Star className="mb-3 text-yellow-500" />

                <p className="text-3xl font-bold">{user.worker.rating}</p>

                <p className="text-gray-500">Rating</p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <Briefcase className="mb-3 text-blue-500" />

                <p className="text-3xl font-bold">
                  {user.worker.completedJobs}
                </p>

                <p className="text-gray-500">Jobs Completed</p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <CheckCircle className="mb-3 text-green-500" />

                <p className="text-3xl font-bold">{user.worker.experience}</p>

                <p className="text-gray-500">Years</p>
              </div>
            </div>
          )}
        </div>

        {/* Worker Data */}

        {user.worker && (
          <>
            {/* Skills */}

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-semibold">Skills</h2>

              <div className="flex flex-wrap gap-3">
                {(user.worker.skill ?? []).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-gradient-to-r from-[#D8B67C] to-[#C8A56A] px-5 py-2 text-sm font-semibold text-white shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience & Bio */}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Experience</h2>

                <p className="text-lg text-gray-700">
                  {user.worker.experience} years
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Bio</h2>

                <p className="text-gray-700">
                  {user.worker.bio || "No bio added yet"}
                </p>
              </div>
            </div>

            {/* Location */}

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Location</h2>

              <div className="flex gap-4">
                <MapPin className="mt-1 text-[#C8A56A]" />

                <div>
                  <p className="text-gray-700">
                    {[user.worker.area, user.worker.city, user.worker.state]
                      .filter(Boolean)
                      .join(", ") || "Location not provided"}
                  </p>

                  {user.worker.pincode && (
                    <p className="mt-1 text-sm text-gray-500">
                      PIN: {user.worker.pincode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
