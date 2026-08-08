interface EarningsJob {
  id: string;
  description: string;
  budget: number;
  updatedAt: string;
}

interface Props {
  jobs: EarningsJob[];
}

export default function RecentTransactions({ jobs }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Recent Transactions</h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No completed jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <p className="font-semibold">{job.description}</p>

                <p className="text-sm text-gray-500">
                  {new Date(job.updatedAt).toLocaleDateString()}
                </p>
              </div>

              <span className="font-bold text-green-600">₹{job.budget}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
