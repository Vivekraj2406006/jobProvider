"use client";

import {
  ShieldCheck,
  Clock3,
  BadgeIndianRupee,
  Star,
  Headphones,
  RefreshCw,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    color: "text-green-600",
    bg: "bg-green-50",
    title: "Verified Workers",
    description:
      "Every worker is verified and reviewed before joining the platform.",
  },
  {
    icon: Clock3,
    color: "text-blue-600",
    bg: "bg-blue-50",
    title: "Fast Assignment",
    description:
      "Nearest available worker gets assigned automatically in seconds.",
  },
  {
    icon: BadgeIndianRupee,
    color: "text-purple-600",
    bg: "bg-purple-50",
    title: "Transparent Pricing",
    description:
      "Fixed pricing with no hidden charges.",
  },
  {
    icon: Star,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
    title: "Top Rated Service",
    description:
      "Customers consistently rate our services highly.",
  },
  {
    icon: Headphones,
    color: "text-blue-600",
    bg: "bg-blue-50",
    title: "24/7 Support",
    description:
      "Our support team is always available to help you.",
  },
  {
    icon: RefreshCw,
    color: "text-purple-600",
    bg: "bg-purple-50",
    title: "Easy Rebooking",
    description:
      "Book the same trusted professional again with one click.",
  },
];

const duplicatedFeatures = [...features, ...features];

export default function WhyChooseUs() {
  return (
    <section className="mt-20">
      <h2 className="mb-10 text-center text-3xl font-bold">
        Why Choose Us
      </h2>

      <div className="relative">
        {/* Left Fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-gray-50 to-transparent" />

        {/* Right Fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-gray-50 to-transparent" />

        <div className="overflow-hidden">
          <div className="marquee flex w-max gap-5">
            {duplicatedFeatures.map(
              (
                {
                  icon: Icon,
                  color,
                  bg,
                  title,
                  description,
                },
                index
              ) => (
                <div
                  key={`${title}-${index}`}
                  className="w-[280px] flex-shrink-0 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`mb-4 inline-flex rounded-2xl p-3 ${bg}`}
                  >
                    <Icon
                      className={`h-6 w-6 ${color}`}
                    />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-gray-400">
        Hover to pause
      </p>

      <style jsx>{`
        .marquee {
          animation: marquee 22s linear infinite;
        }

        .marquee:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
