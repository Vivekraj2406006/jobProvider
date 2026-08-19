"use client";

import { Wrench } from "lucide-react";

interface SkillsCardProps {
  skills: string[];
}

export default function SkillsCard({ skills }: SkillsCardProps) {
  return (
    <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
      <h2 className="text-lg font-bold text-gray-900">Primary Skills</h2>
      <p className="text-xs text-gray-400 mt-0.5 mb-6">Service categories you are verified to perform</p>

      {skills.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No verified skills added to profile.</p>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {skills.map((skill) => (
            <div
              key={skill}
              className="group flex items-center gap-2 rounded-xl bg-amber-50/50 border border-amber-100/70 px-4 py-2 text-xs font-bold text-amber-800 transition duration-200 hover:bg-amber-100/50"
            >
              <Wrench size={14} className="text-amber-600 transition-transform group-hover:rotate-12" />
              <span>{skill}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
