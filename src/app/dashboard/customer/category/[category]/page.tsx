import ServiceGrid from "@/components/CustomerDashboard/ServiceGrid";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold capitalize">
          {category.replaceAll("-", " ")}
        </h1>

        <ServiceGrid category={category} />
      </div>
    </div>
  );
}
