import { FileText } from "lucide-react";

interface DescriptionCardProps {
  description: string;
}

export default function DescriptionCard({ description }: DescriptionCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-blue-100 p-3">
          <FileText className="text-blue-600" size={20} />
        </div>

        <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
      </div>
      <div className="rounded-xl bg-gray-50 p-4">
        <p className="leading-7 text-gray-700">{description}</p>
      </div>
    </div>
  );
}
