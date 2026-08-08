interface DashboardHeaderProps {
  workerName: string;
}
export default function DashboardHeader({ workerName }: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          👋 Welcome, {workerName}
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your work today.
        </p>
      </div>
      <div className="rounded-xl bg-gray-100 px-4 py-2">
        <p className="text-sm font-medium text-gray-600">{today}</p>
      </div>
    </div>
  );
}
