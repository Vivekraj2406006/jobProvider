import { Mail, Phone, FileText, Briefcase } from "lucide-react";
import { WorkerProfile } from "@/types/workerProfile";
import { ReactNode } from "react";
interface Props {
  profile: WorkerProfile;
}

export default function PersonalInfo({
  profile,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        Personal Information
      </h2>

      <div className="space-y-5">
        <InfoRow
          icon={<Mail size={18} />}
          title="Email"
          value={profile.email}
        />

        <InfoRow
          icon={<Phone size={18} />}
          title="Phone"
          value={profile.phone || "Not Added"}
        />

        <InfoRow
          icon={<Briefcase size={18} />}
          title="Experience"
          value={`${profile.experience} years`}
        />

        <InfoRow
          icon={<FileText size={18} />}
          title="Bio"
          value={profile.bio || "No bio available"}
        />
      </div>
    </div>
  );
}

interface InfoRowProps {
  icon: ReactNode;
  title: string;
  value: string;
}

function InfoRow({
  icon,
  title,
  value,
}: InfoRowProps) {
  return (
    <div className="flex gap-4">
      <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">
          {title}
        </p>

        <p className="font-medium text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}
