"use client";

import { useEffect, useState } from "react";
import { Check, Clock, Save } from "lucide-react";
import { useWorkerProfile } from "@/hooks/useWorkerProfile";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WorkerAvailabilityPage() {
  const { profile, loading, error, refresh } = useWorkerProfile();

  const [available, setAvailable] = useState(true);
  const [workingDays, setWorkingDays] = useState<boolean[]>([
    true,
    true,
    true,
    true,
    true,
    true,
    false,
  ]);

  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("19:00");
  const [urgentJobs, setUrgentJobs] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setAvailable(profile.isAvailable);
    }
  }, [profile]);

  function toggleDay(index: number) {
    setWorkingDays((current) =>
      current.map((day, i) =>
        i === index ? !day : day
      )
    );

    setSaved(false);
  }

  function saveChanges() {
    /*
     * API/database update will be connected here later.
     */
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

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
          Failed to load availability
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

  return (
    <div className="min-h-screen bg-[#f5f8f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#10201b]">
            Availability
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Choose when you are available to receive new jobs.
          </p>
        </div>

        {/* Current Status */}
        <div
          className={`mb-6 rounded-2xl border p-5 shadow-sm ${
            available
              ? "border-green-200 bg-green-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    available
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />

                <h2 className="font-bold text-[#10201b]">
                  {available
                    ? "You are available"
                    : "You are unavailable"}
                </h2>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                {available
                  ? "You can receive new job assignments."
                  : "You will not receive new job assignments."}
              </p>
            </div>

            {/* Toggle */}
            <button
              type="button"
              onClick={() => {
                setAvailable((current) => !current);
                setSaved(false);
              }}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                available
                  ? "bg-[#146356]"
                  : "bg-gray-300"
              }`}
              aria-label="Toggle availability"
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  available
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Working Days */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
            <h2 className="text-lg font-bold text-[#10201b]">
              Working Days
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select the days when you accept bookings.
            </p>
          </div>

          <div className="p-5 sm:p-6">

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {DAYS.map((day, index) => {
                const active = workingDays[index];

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(index)}
                    className={`rounded-xl border p-4 text-center transition ${
                      active
                        ? "border-[#146356] bg-[#e5f0ec] text-[#146356]"
                        : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-center">
                      {active ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#146356] text-white">
                          <Check size={15} />
                        </div>
                      ) : (
                        <div className="h-7 w-7 rounded-full border border-gray-300" />
                      )}
                    </div>

                    <p className="mt-2 text-sm font-semibold">
                      {day.substring(0, 3)}
                    </p>
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              {workingDays.filter(Boolean).length} days selected
            </p>
          </div>
        </div>

        {/* Working Hours */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f0ec] text-[#146356]">
                <Clock size={19} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#10201b]">
                  Working Hours
                </h2>

                <p className="text-sm text-gray-500">
                  Set your daily working hours.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">

            {/* Start */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Start Time
              </label>

              <input
                type="time"
                value={startTime}
                onChange={(event) => {
                  setStartTime(event.target.value);
                  setSaved(false);
                }}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#146356] focus:ring-2 focus:ring-[#146356]/10"
              />
            </div>

            {/* End */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                End Time
              </label>

              <input
                type="time"
                value={endTime}
                onChange={(event) => {
                  setEndTime(event.target.value);
                  setSaved(false);
                }}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#146356] focus:ring-2 focus:ring-[#146356]/10"
              />
            </div>
          </div>
        </div>

        {/* Job Preferences */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
            <h2 className="text-lg font-bold text-[#10201b]">
              Job Preferences
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose what type of jobs you want to receive.
            </p>
          </div>

          <div className="p-5 sm:p-6">

            <div className="flex items-center justify-between gap-5">

              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#10201b]">
                  Urgent same-day jobs
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Receive priority requests that need to be completed today.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setUrgentJobs((current) => !current);
                  setSaved(false);
                }}
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  urgentJobs
                    ? "bg-[#146356]"
                    : "bg-gray-300"
                }`}
                aria-label="Toggle urgent jobs"
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    urgentJobs
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">

          {saved && (
            <div className="flex items-center gap-2 text-sm font-medium text-green-600 sm:mr-auto">
              <Check size={16} />
              Changes saved
            </div>
          )}

          <button
            type="button"
            onClick={saveChanges}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#146356] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#105448]"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
