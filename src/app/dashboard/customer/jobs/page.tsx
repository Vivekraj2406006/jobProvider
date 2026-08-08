import JobsList from "@/components/CustomerDashboard/JobsList";

export default function CustomerJobsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-4xl font-bold">
          My Jobs
        </h1>

        <p className="mb-8 text-gray-600">
          Track all your service requests.
        </p>

        <JobsList />
      </div>
    </div>
  );
}
