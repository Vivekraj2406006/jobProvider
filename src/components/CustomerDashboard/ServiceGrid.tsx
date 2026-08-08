"use client";

import { useEffect, useState } from "react";
import BookServiceModal from "./BookServiceModal";
import ServiceCard from "./ServiceCard";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  imageUrl: string | null;
}

interface Props {
  category: string;
}

export default function ServiceGrid({
  category,
}: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] =
    useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
  }, [category]);

  const fetchServices = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/services/${encodeURIComponent(
          category
        )}`
      );

      const data = await response.json();

      if (data.success) {
        setServices(data.services);
      }
    } catch (error) {
      console.error(
        "Error fetching services:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="text-lg font-medium text-gray-500">
          Loading services...
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow">
        <h2 className="text-xl font-semibold">
          No services available
        </h2>

        <p className="mt-2 text-gray-500">
          Services will appear here once added.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          {category}
        </h2>

        <p className="mt-2 text-gray-500">
          Explore available services in this category.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onBook={() =>
              setSelectedService(service)
            }
          />
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
