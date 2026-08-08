import Hero from "@/components/CustomerDashboard/Hero";
import PopularServices from "@/components/CustomerDashboard/PopularServices";
import ServicesByCategory from "@/components/CustomerDashboard/ServicesByCategory";
import WhyChooseUs from "@/components/CustomerDashboard/WhyChooseUs";
import Stats from "@/components/CustomerDashboard/Stats";

export default function CustomerDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-10 sm:px-6">
        <Hero />
        <PopularServices />
        <section className="mt-16">
          <ServicesByCategory />
        </section>
        <WhyChooseUs />
        <Stats />
      </div>
    </div>
  );
}
