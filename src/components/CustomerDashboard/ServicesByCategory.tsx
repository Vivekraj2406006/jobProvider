"use client";

import { useEffect, useMemo, useState } from "react";
import ServiceCard from "./ServiceCard";
import BookServiceModal from "./BookServiceModal";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  imageUrl: string | null;
}

export default function ServicesByCategory() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedService, setSelectedService] =
    useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/services", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.services)) {
        setServices(data.services);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load services.");
    } finally {
      setLoading(false);
    }
  }

  const groupedServices = useMemo(() => {
    return services.reduce(
      (acc: Record<string, Service[]>, service) => {
        const category =
          service.category?.trim() || "Other";

        if (!acc[category]) {
          acc[category] = [];
        }

        acc[category].push(service);

        return acc;
      },
      {}
    );
  }, [services]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-gray-500">
          Loading services...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-8 text-center">
        <p className="text-red-600">{error}</p>

        <button
          onClick={fetchServices}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow">
        <h3 className="text-xl font-semibold">
          No Services Available
        </h3>

        <p className="mt-2 text-gray-500">
          Services will appear here once added.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-16">
        {Object.entries(groupedServices)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([category, categoryServices]) => (
            <section key={category}>
              <div className="mb-6">
                <h2 className="text-3xl font-bold">
                  {category}
                </h2>

                <p className="mt-1 text-gray-500">
                  Explore available services
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onBook={() =>
                      setSelectedService(service)
                    }
                  />
                ))}
              </div>
            </section>
          ))}
      </div>

      {selectedService && (
        <BookServiceModal
          service={selectedService}
          onClose={() =>
            setSelectedService(null)
          }
        />
      )}
    </>
  );
}
