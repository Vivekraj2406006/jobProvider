"use client";

import { useState } from "react";
import { Plus, X, Check } from "lucide-react";
import { useWorkerProfile } from "@/hooks/useWorkerProfile";

const SUGGESTED_SKILLS = [
  "AC Repair",
  "AC Installation",
  "Refrigerator Repair",
  "Washing Machine Repair",
  "TV Repair",
  "Plumbing",
  "Electrical",
  "Geyser Repair",
  "Chimney Installation",
  "Smart Home Setup",
];

export default function WorkerSkillsPage() {
  const { profile, loading, error, refresh } = useWorkerProfile();

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [saved, setSaved] = useState(false);

  /*
   * Add the skills from the worker profile when the profile loads.
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f8f6] px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-5">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          Failed to load skills
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {error}
        </p>

        <button
          onClick={refresh}
          className="mt-5 rounded-xl bg-[#146356] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Worker profile not found
          </h2>
        </div>
      </div>
    );
  }

  /*
   * Initialize skills from profile.
   *
   * We use a small local check so the profile skills
   * are loaded into the page without another API call.
   */
  if (
    skills.length === 0 &&
    profile.skill &&
    profile.skill.length > 0
  ) {
    setSkills(profile.skill);
  }

  function addSkill(skill: string) {
    const value = skill.trim();

    if (!value) return;

    if (skills.some((item) => item.toLowerCase() === value.toLowerCase())) {
      return;
    }

    setSkills((current) => [...current, value]);
    setSaved(false);
  }

  function removeSkill(skill: string) {
    setSkills((current) =>
      current.filter((item) => item !== skill)
    );

    setSaved(false);
  }

  function handleAddSkill() {
    addSkill(newSkill);
    setNewSkill("");
  }

  function saveSkills() {
    /*
     * Database/API saving will be connected later.
     * For now this confirms the UI action.
     */
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  const availableSuggestions = SUGGESTED_SKILLS.filter(
    (skill) =>
      !skills.some(
        (current) =>
          current.toLowerCase() === skill.toLowerCase()
      )
  );

  return (
    <div className="min-h-screen bg-[#f5f8f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#10201b]">
            Skills & Services
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the services you provide to customers.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Active Services
            </p>

            <p className="mt-2 text-2xl font-bold text-[#10201b]">
              {skills.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Experience
            </p>

            <p className="mt-2 text-2xl font-bold text-[#10201b]">
              {profile.experience}
              <span className="ml-1 text-sm font-medium text-gray-500">
                years
              </span>
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:col-span-1">
            <p className="text-sm text-gray-500">
              Completed Jobs
            </p>

            <p className="mt-2 text-2xl font-bold text-[#10201b]">
              {profile.completedJobs}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Card Header */}
          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
            <h2 className="text-lg font-bold text-[#10201b]">
              Your Services
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Customers can book you for these services.
            </p>
          </div>

          <div className="p-5 sm:p-6">

            {/* Current Skills */}
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">
                Active Skills
              </p>

              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div
                      key={skill}
                      className="inline-flex max-w-full items-center gap-2 rounded-full bg-[#e5f0ec] px-3.5 py-2 text-sm font-medium text-[#146356]"
                    >
                      <Check
                        size={14}
                        className="shrink-0"
                      />

                      <span className="max-w-[220px] break-words">
                        {skill}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 shrink-0 rounded-full p-0.5 transition hover:bg-[#cfe2db]"
                        aria-label={`Remove ${skill}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                  <p className="text-sm text-gray-500">
                    You haven't added any skills yet.
                  </p>
                </div>
              )}
            </div>

            {/* Add Skill */}
            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold text-gray-700">
                Add a Skill
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(event) =>
                    setNewSkill(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleAddSkill();
                    }
                  }}
                  placeholder="e.g. AC Repair"
                  className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#146356] focus:ring-2 focus:ring-[#146356]/10"
                />

                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#146356] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#105448]"
                >
                  <Plus size={16} />
                  Add Skill
                </button>
              </div>
            </div>

            {/* Suggestions */}
            {availableSuggestions.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-sm font-semibold text-gray-700">
                  Suggested Services
                </p>

                <div className="flex flex-wrap gap-2">
                  {availableSuggestions.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3.5 py-2 text-sm text-gray-600 transition hover:border-[#146356] hover:bg-[#e5f0ec] hover:text-[#146356]"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Save */}
            <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
              {saved && (
                <div className="flex items-center gap-2 text-sm font-medium text-green-600 sm:mr-auto">
                  <Check size={16} />
                  Changes saved
                </div>
              )}

              <button
                type="button"
                onClick={saveSkills}
                className="rounded-xl bg-[#182b26] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#10201b]"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
