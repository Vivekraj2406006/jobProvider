"use client";

import { FileText } from "lucide-react";

interface DescriptionCardProps {
  description: string;
}

export default function DescriptionCard({ description }: DescriptionCardProps) {
  return (
    <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
          <FileText size={18} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Job Description</h2>
          <p className="text-xs text-gray-400 mt-0.5">Specifications of service request</p>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-50 bg-gray-50/20 p-5">
        <p className="text-sm font-semibold leading-relaxed text-gray-700 whitespace-pre-line">{description}</p>
      </div>
    </div>
  );
}
