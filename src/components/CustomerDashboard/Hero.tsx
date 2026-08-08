"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";

interface Service {
  id: string;
  name: string;
}

interface HeroData {
  workers: number;
  completedJobs: number;
  services: Service[];
}

export default function Hero() {
  const [data, setData] = useState<HeroData>({
    workers: 0,
    completedJobs: 0,
    services: [],
  });

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      const result = await response.json();

      if (result.success) {
        setData({
          workers: result.workers,
          completedJobs: result.completedJobs,
          services: result.services || [],
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="overflow-hidden rounded-[32px] bg-[#FAF7F2] shadow-xl">
      <div className="grid items-center gap-12 px-8 py-12 lg:grid-cols-2 lg:px-14">
        {/* LEFT */}
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-[#FF7A00]">
            Trusted Home Services
          </span>

          <h1
            className="mt-6 text-5xl font-semibold leading-tight text-[#1B2A4A] lg:text-7xl"
            style={{
              fontFamily: "Fraunces, serif",
            }}
          >
            Skilled hands,
            <br />
            right when
            <br />
            you{" "}
            <span className="italic text-[#FF7A00]">
              need
            </span>{" "}
            them.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Electricians, plumbers, cleaners,
            beauticians and technicians —
            verified, trusted and assigned
            automatically near your location.
          </p>

          {/* Search */}
          <div className="mt-10 flex flex-col overflow-hidden rounded-2xl border bg-white shadow-lg md:flex-row">
            <div className="flex flex-1 items-center px-5 py-4">
              <Search className="mr-3 h-5 w-5 text-gray-400" />

              <input
                type="text"
                placeholder="AC Repair, Plumber, Electrician..."
                className="w-full outline-none"
              />
            </div>

            <button className="bg-[#FF7A00] px-8 py-4 font-semibold text-white transition hover:bg-orange-600">
              Find Service
            </button>
          </div>

          {/* Stats */}
          <div className="mt-8 flex gap-4">
            <div className="rounded-xl bg-white px-5 py-3 shadow">
              <p className="text-2xl font-bold text-[#1B2A4A]">
                {data.workers}+
              </p>

              <p className="text-sm text-gray-500">
                Active Workers
              </p>
            </div>

            <div className="rounded-xl bg-white px-5 py-3 shadow">
              <p className="text-2xl font-bold text-[#1B2A4A]">
                {data.completedJobs}+
              </p>

              <p className="text-sm text-gray-500">
                Completed Jobs
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex items-center justify-center">
          {/* Main Circle */}
          <div className="absolute h-[420px] w-[420px] rounded-full bg-[#1B2A4A]" />

          {/* Orange Half Circle */}
          <div
            className="absolute h-[420px] w-[210px] rounded-r-full bg-[#FF7A00]"
            style={{
              right: "50%",
              transform: "translateX(100%)",
            }}
          />

          {/* Worker SVG */}
          <div className="relative z-10 h-[480px] w-[480px]">
            <Image
              src="/hero-worker.svg"
              alt="Worker"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Bottom Services */}
      <div className="border-t border-gray-200 px-8 py-5">
        <div className="flex flex-wrap items-center gap-8 text-sm font-medium text-[#1B2A4A]">
          <span className="text-xs uppercase tracking-widest text-gray-400">
            Popular Services
          </span>

          {data.services.map((service) => (
            <span key={service.id}>
              {service.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
