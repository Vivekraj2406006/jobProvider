import { Star, BriefcaseBusiness, UserCircle2 } from "lucide-react";
import { WorkerProfile } from "@/types/workerProfile";

interface ProfileHeaderProps {
  profile: WorkerProfile;
}

export default function ProfileHeader({
  profile,
}: ProfileHeaderProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col items-center">
        {profile.profileImage ? (
          <img
            src={profile.profileImage}
            alt={profile.name}
            className="h-28 w-28 rounded-full object-cover border-4 border-blue-100"
          />
        ) : (
          <UserCircle2
            size={100}
            className="text-gray-400"
          />
        )}

        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          {profile.name}
        </h1>

        <p className="mt-1 text-gray-500">
          {profile.skill.join(", ")}
        </p>

        <div className="mt-6 flex gap-8">
          <div className="flex items-center gap-2">
            <Star
              size={20}
              className="fill-yellow-400 text-yellow-400"
            />

            <span className="font-semibold">
              {profile.rating.toFixed(1)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <BriefcaseBusiness
              size={20}
              className="text-blue-600"
            />

            <span className="font-semibold">
              {profile.completedJobs} Jobs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
