import { Wrench } from "lucide-react";

interface SkillsCardProps {
  skills: string[];
}

export default function SkillsCard({ skills }: SkillsCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Skills</h2>

      {skills.length === 0 ? (
        <p className="text-gray-500">No skills added.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div
              key={skill}
              className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700"
            >
              <Wrench size={16} />

              <span>{skill}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
