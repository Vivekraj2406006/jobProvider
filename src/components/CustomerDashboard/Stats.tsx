"use client";

import { useEffect, useState } from "react";

interface StatsData {
  completedJobs: number;
  activeWorkers: number;
  totalServices: number;
  totalCustomers: number;
}

export default function Stats() {
  const [stats, setStats] = useState<StatsData>({
    completedJobs: 0,
    activeWorkers: 0,
    totalServices: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        "/api/dashboard/home-stats",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (data.success) {
        setStats(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const statCards = [
    {
      value: stats.completedJobs,
      label: "Completed Jobs",
    },
    {
      value: stats.activeWorkers,
      label: "Active Workers",
    },
    {
      value: stats.totalServices,
      label: "Available Services",
    },
    {
      value: stats.totalCustomers,
      label: "Customers",
    },
  ];

  return (
    <section className="mt-20">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white p-8 text-center shadow transition hover:-translate-y-1 hover:shadow-xl"
          >
            <h3 className="text-4xl font-bold text-blue-600">
              {stat.value}+
            </h3>

            <p className="mt-2 text-gray-600">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
