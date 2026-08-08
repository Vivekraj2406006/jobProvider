"use client";

import Image from "next/image";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  imageUrl: string | null;
}

interface Props {
  service: Service;
  onBook: () => void;
}

export default function ServiceCard({
  service,
  onBook,
}: Props) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={
            service.imageUrl ||
            "/services/default-service.jpg"
          }
          alt={service.name}
          fill
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Category */}
        {service.category && (
          <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 shadow">
            {service.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900">
          {service.name}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {service.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">
              Starting from
            </p>

            <p className="text-xl font-bold text-green-600">
              ₹{service.price}
            </p>
          </div>

          <button
            onClick={onBook}
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
