import { JobStatus } from "@prisma/client";
import { JOB_STATUS, JobAction } from "@/lib/worker/jobStatus";

interface JobActionsProps {
  status: JobStatus;
  onAction?: (action: JobAction["key"]) => void;
}

export default function JobActions({ status, onAction }: JobActionsProps) {
  const config = JOB_STATUS[status];

  if (config.actions.length === 0) {
    return null;
  }

  function getButtonStyle(action: JobAction) {
    switch (action.variant) {
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white";

      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white";

      case "primary":
        return "bg-blue-600 hover:bg-blue-700 text-white";

      case "secondary":
        return "bg-gray-200 hover:bg-gray-300 text-gray-800";

      default:
        return "bg-gray-200";
    }
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {config.actions.map((action) => (
        <button
          key={action.key}
          type="button"
          onClick={() => onAction?.(action.key)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${getButtonStyle(
            action,
          )}`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
