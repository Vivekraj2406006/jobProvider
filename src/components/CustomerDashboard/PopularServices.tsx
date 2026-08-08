"use client";

import {
  Wrench,
  Droplets,
  Zap,
  Home,
} from "lucide-react";

const services = [
  {
    name: "AC Repair",
    price: "Starting ₹899",
    icon: Wrench,
  },
  {
    name: "Plumbing",
    price: "Starting ₹299",
    icon: Droplets,
  },
  {
    name: "Electrician",
    price: "Starting ₹299",
    icon: Zap,
  },
  {
    name: "House Cleaning",
    price: "Starting ₹499",
    icon: Home,
  },
];

export default function PopularServices() {
  return (
    <section className="mt-16">
      <h2 className="mb-8 text-3xl font-bold">
        Popular Services
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <div
              key={service.name}
              className="rounded-2xl bg-white p-6 shadow transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <Icon className="mb-4 h-10 w-10 text-blue-600" />

              <h3 className="text-xl font-bold">
                {service.name}
              </h3>

              <p className="mt-2 text-gray-500">
                {service.price}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
