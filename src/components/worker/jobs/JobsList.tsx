import { WorkerJob } from "@/types/workerJob";
import JobCard from "./JobCard";
import EmptyJobs from "./EmptyJobs";

interface JobsListProps {
  jobs: WorkerJob[];

  onAction?: (
    jobId: string,
    action:
      | "accept"
      | "reject"
      | "startJourney"
      | "markArrived"
      | "startWork"
      | "complete"
      | "view"
  ) => void;
}

export default function JobsList({
  jobs,
  onAction,
}: JobsListProps) {
  if (jobs.length === 0) {
    return <EmptyJobs />;
  }

  return (
    <div className="grid gap-6">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onAction={onAction}
        />
      ))}
    </div>
  );
}
