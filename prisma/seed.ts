import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const services = [
  {
    name: "AC Service",
    description: "Routine AC servicing including cleaning of filters and performance inspection.",
    price: 599,
    category: "Appliance Repair",
    imageUrl: "/services/ac-service.jpg",
  },
  {
    name: "AC Repair",
    description: "Diagnosis and repair of cooling, gas leakage, and electrical issues.",
    price: 899,
    category: "Appliance Repair",
    imageUrl: "/services/ac-repair.jpg",
  },

  {
    name: "Refrigerator Repair",
    description: "Repair of cooling issues, compressors, thermostats, and wiring.",
    price: 699,
    category: "Appliance Repair",
    imageUrl: "/services/refrigerator.jpg",
  },

  {
    name: "Washing Machine Repair",
    description: "Repair for semi-automatic and fully automatic washing machines.",
    price: 649,
    category: "Appliance Repair",
    imageUrl: "/services/washing-machine.jpg",
  },

  {
    name: "TV Repair",
    description: "LED, LCD, and Smart TV repair and diagnostics.",
    price: 599,
    category: "Appliance Repair",
    imageUrl: "/services/tv-repair.jpg",
  },

  {
    name: "Plumber Visit",
    description: "Professional plumbing inspection and minor repairs.",
    price: 299,
    category: "Home Services",
    imageUrl: "/services/plumber.jpg",
  },

  {
    name: "Tap Repair",
    description: "Repair and replacement of leaking taps and fittings.",
    price: 399,
    category: "Home Services",
    imageUrl: "/services/tap-repair.jpg",
  },

  {
    name: "Electrician Visit",
    description: "Electrical inspection and troubleshooting.",
    price: 299,
    category: "Home Services",
    imageUrl: "/services/electrician.jpg",
  },

  {
    name: "Fan Installation",
    description: "Ceiling fan installation and wiring setup.",
    price: 449,
    category: "Home Services",
    imageUrl: "/services/fan-installation.jpg",
  },

  {
    name: "Carpenter Visit",
    description: "Furniture repair and installation services.",
    price: 349,
    category: "Home Services",
    imageUrl: "/services/carpenter.jpg",
  },

  {
    name: "Furniture Repair",
    description: "Repair of tables, chairs, wardrobes, and cabinets.",
    price: 699,
    category: "Home Services",
    imageUrl: "/services/furniture-repair.jpg",
  },

  {
    name: "Bathroom Cleaning",
    description: "Deep cleaning and sanitization of bathrooms.",
    price: 499,
    category: "Cleaning",
    imageUrl: "/services/bathroom-cleaning.jpg",
  },

  {
    name: "Kitchen Cleaning",
    description: "Deep kitchen cleaning including chimney exterior and counters.",
    price: 799,
    category: "Cleaning",
    imageUrl: "/services/kitchen-cleaning.jpg",
  },

  {
    name: "Sofa Cleaning",
    description: "Professional vacuuming and stain treatment for sofas.",
    price: 699,
    category: "Cleaning",
    imageUrl: "/services/sofa-cleaning.jpg",
  },

  {
    name: "Full Home Cleaning",
    description: "Complete cleaning package for apartments and houses.",
    price: 2999,
    category: "Cleaning",
    imageUrl: "/services/home-cleaning.jpg",
  },

  {
    name: "Haircut At Home",
    description: "Professional haircut service at your doorstep.",
    price: 299,
    category: "Beauty & Wellness",
    imageUrl: "/services/haircut.jpg",
  },

  {
    name: "Facial",
    description: "Skin care and facial treatment by trained professionals.",
    price: 799,
    category: "Beauty & Wellness",
    imageUrl: "/services/facial.jpg",
  },

  {
    name: "Massage Therapy",
    description: "Relaxing full-body massage at home.",
    price: 1299,
    category: "Beauty & Wellness",
    imageUrl: "/services/massage.jpg",
  },

  {
    name: "Laptop Repair",
    description: "Hardware and software troubleshooting for laptops.",
    price: 799,
    category: "Technology",
    imageUrl: "/services/laptop-repair.jpg",
  },

  {
    name: "Mobile Repair",
    description: "Screen, battery, charging, and software issue repair.",
    price: 599,
    category: "Technology",
    imageUrl: "/services/mobile-repair.jpg",
  },

  {
    name: "WiFi Setup",
    description: "Router installation and home network setup.",
    price: 499,
    category: "Technology",
    imageUrl: "/services/wifi-setup.jpg",
  },
];

async function main() {
  await prisma.service.deleteMany();

  for (const service of services) {
    await prisma.service.create({
      data: service,
    });
  }

  console.log("✅ Services seeded successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
