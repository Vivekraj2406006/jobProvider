"use client";
import { useRouter } from "next/navigation";
import { useWorkerJobActions } from "@/hooks/useWorkerJobActions";
import { JobAction } from "@/types/jobAction";
import { useParams } from "next/navigation";
import { IndianRupee } from "lucide-react";
import {
  ActionFooter,
  AddressCard,
  CustomerCard,
  DescriptionCard,
  JobHeader,
  JobTimeline,
} from "@/components/worker/job-details";
import { useWorkerJobDetails } from "@/hooks/useWorkerJobDetails";

export default function WorkerJobDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const { performAction } = useWorkerJobActions();
  const { job, loading, error, refresh } = useWorkerJobDetails(
    params.id as string,
  );
  async function handleAction(jobId: string, action: JobAction) {
    if (action === "view") return;

    try {
      await performAction(jobId, action);

      await refresh();
    } catch (error) {
      console.error(error);
    }
  }
  if (loading) {
    return <div className="p-8">Loading Job...</div>;
  }

  if (error) {
    return <div className="rounded-xl bg-red-50 p-6 text-red-600">{error}</div>;
  }
  if (!job) {
    return <div className="p-8 text-gray-500">Job not found.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <JobHeader
        service={job.service}
        status={job.status}
        budget={job.budget}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <CustomerCard customer={job.customer} />

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="mb-6 text-xl font-semibold">Payment</h2>

          <div className="flex gap-3">
            <IndianRupee className="text-green-600" />

            <span className="font-semibold">₹ {job.budget}</span>
          </div>
        </div>
      </div>

      <DescriptionCard description={job.description} />

      <AddressCard address={job.address} location={job.location} />
      <JobTimeline status={job.status} />
      <ActionFooter
        jobId={job.id}
        status={job.status}
        onAction={handleAction}
      />
    </div>
  );
}
