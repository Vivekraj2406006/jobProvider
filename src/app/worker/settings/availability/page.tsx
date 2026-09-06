"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Clock, Loader2, Save, Wifi, WifiOff } from "lucide-react";

import { useWorkerAvailability } from "@/hooks/useWorkerAvailability";
import type { WorkerAvailabilityEntry } from "@/lib/api/workerAvailabilityApi";
import { useWorkerProfile } from "@/hooks/useWorkerProfile";

interface AvailabilityDay {
  dayOfWeek: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

const DAYS = [
  { dayOfWeek: 0, label: "Sunday", short: "Sun" },
  { dayOfWeek: 1, label: "Monday", short: "Mon" },
  { dayOfWeek: 2, label: "Tuesday", short: "Tue" },
  { dayOfWeek: 3, label: "Wednesday", short: "Wed" },
  { dayOfWeek: 4, label: "Thursday", short: "Thu" },
  { dayOfWeek: 5, label: "Friday", short: "Fri" },
  { dayOfWeek: 6, label: "Saturday", short: "Sat" },
];

const DEFAULT_START_TIME = "09:00";
const DEFAULT_END_TIME = "19:00";

function createDefaultSchedule(): AvailabilityDay[] {
  return DAYS.map((day) => ({
    dayOfWeek: day.dayOfWeek,
    enabled: false,
    startTime: DEFAULT_START_TIME,
    endTime: DEFAULT_END_TIME,
  }));
}

function normalizeSchedule(
  availability: WorkerAvailabilityEntry[],
): AvailabilityDay[] {
  return DAYS.map((day) => {
    const saved = availability.find(
      (entry) => entry.dayOfWeek === day.dayOfWeek,
    );

    return {
      dayOfWeek: day.dayOfWeek,
      enabled: saved?.isActive ?? false,
      startTime: saved?.startTime ?? DEFAULT_START_TIME,
      endTime: saved?.endTime ?? DEFAULT_END_TIME,
    };
  });
}

export default function WorkerAvailabilityPage() {
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    refresh: refreshProfile,
  } = useWorkerProfile();

  const {
    availability,
    loading: availabilityLoading,
    saving: availabilitySaving,
    error: availabilityError,
    save: saveAvailability,
  } = useWorkerAvailability();

  const [schedule, setSchedule] = useState<AvailabilityDay[]>(
    createDefaultSchedule,
  );

  const [available, setAvailable] = useState(true);
  const [updatingOnlineStatus, setUpdatingOnlineStatus] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  /*
   * Load the worker's online/offline status from the worker profile.
   */
  useEffect(() => {
    if (profile) {
      setAvailable(profile.isAvailable);
    }
  }, [profile]);

  /*
   * Load the real weekly availability returned by the backend.
   */
  useEffect(() => {
    setSchedule(normalizeSchedule(availability));
  }, [availability]);

  /*
   * Clear the "saved" message whenever the user edits the schedule.
   */
  useEffect(() => {
    if (!saved) return;

    const timer = window.setTimeout(() => {
      setSaved(false);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [saved]);

  const selectedDaysCount = useMemo(
    () => schedule.filter((day) => day.enabled).length,
    [schedule],
  );

  function toggleDay(dayOfWeek: number) {
    setSchedule((current) =>
      current.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              enabled: !day.enabled,
            }
          : day,
      ),
    );

    setSaved(false);
    setSaveError(null);
  }

  function updateStartTime(dayOfWeek: number, value: string) {
    setSchedule((current) =>
      current.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              startTime: value,
            }
          : day,
      ),
    );

    setSaved(false);
    setSaveError(null);
  }

  function updateEndTime(dayOfWeek: number, value: string) {
    setSchedule((current) =>
      current.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              endTime: value,
            }
          : day,
      ),
    );

    setSaved(false);
    setSaveError(null);
  }

  function validateSchedule(): string | null {
    const enabledDays = schedule.filter((day) => day.enabled);

    for (const day of enabledDays) {
      if (!day.startTime || !day.endTime) {
        const dayLabel =
          DAYS.find((item) => item.dayOfWeek === day.dayOfWeek)?.label ??
          "Selected day";

        return `${dayLabel} must have both a start time and an end time.`;
      }

      if (day.startTime >= day.endTime) {
        const dayLabel =
          DAYS.find((item) => item.dayOfWeek === day.dayOfWeek)?.label ??
          "Selected day";

        return `${dayLabel} must end after it starts.`;
      }
    }

    return null;
  }

  async function handleSaveSchedule() {
    setSaveError(null);
    setSaved(false);

    const validationError = validateSchedule();

    if (validationError) {
      setSaveError(validationError);
      return;
    }

    const payload: WorkerAvailabilityEntry[] = schedule.map((day) => ({
      dayOfWeek: day.dayOfWeek,
      startTime: day.startTime,
      endTime: day.endTime,
      isActive: day.enabled,
    }));

    try {
      await saveAvailability(payload);
      setSaved(true);
    } catch {
      // The hook already stores the API error.
    }
  }

  async function handleToggleOnlineStatus() {
    if (!profile) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setSaveError("Authentication required. Please log in again.");
      return;
    }

    try {
      setUpdatingOnlineStatus(true);
      setSaveError(null);

      const nextAvailability = !available;

      const response = await fetch("/api/workers/availability", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isAvailable: nextAvailability,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update your availability status.",
        );
      }

      setAvailable(nextAvailability);

      await refreshProfile();
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Failed to update your availability status.",
      );
    } finally {
      setUpdatingOnlineStatus(false);
    }
  }

  const isLoading = profileLoading || availabilityLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f8f6] px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-5">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-40 animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-80 animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-80 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Failed to load availability
          </h2>

          <p className="mt-2 text-sm text-gray-500">{profileError}</p>

          <button
            type="button"
            onClick={refreshProfile}
            className="mt-5 rounded-xl bg-[#146356] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#105448]"
          >
            Try Again
          </button>
        </div>
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

          <p className="mt-2 text-sm text-gray-500">
            Please complete your worker profile before managing availability.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#10201b]">
                Availability
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage when you can receive new booking assignments.
              </p>
            </div>

            <div className="rounded-full border border-[#dbe7e1] bg-white px-3 py-1.5 text-xs font-semibold text-[#146356]">
              {selectedDaysCount} {selectedDaysCount === 1 ? "day" : "days"}{" "}
              scheduled
            </div>
          </div>
        </div>

        {/* API error */}
        {availabilityError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {availabilityError}
          </div>
        )}

        {/* General save/status error */}
        {saveError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {saveError}
          </div>
        )}

        {/* Current online/offline status */}
        <div
          className={`mb-6 rounded-2xl border p-5 shadow-sm transition ${
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
                    available ? "bg-green-500" : "bg-gray-400"
                  }`}
                />

                <h2 className="font-bold text-[#10201b]">
                  {available
                    ? "You are currently online"
                    : "You are currently offline"}
                </h2>
              </div>

              <p className="mt-1 max-w-xl text-sm text-gray-500">
                {available
                  ? "You can receive new booking assignments when your weekly schedule also allows them."
                  : "You will not receive new booking assignments until you go online again."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleOnlineStatus}
              disabled={updatingOnlineStatus}
              className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition ${
                available ? "bg-[#146356]" : "bg-gray-300"
              } disabled:cursor-not-allowed disabled:opacity-60`}
              aria-label="Toggle online availability"
              aria-pressed={available}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full bg-white shadow transition-transform ${
                  available ? "translate-x-7" : "translate-x-1"
                }`}
              >
                {updatingOnlineStatus ? (
                  <Loader2 size={13} className="animate-spin text-[#146356]" />
                ) : available ? (
                  <Wifi size={13} className="text-[#146356]" />
                ) : (
                  <WifiOff size={13} className="text-gray-500" />
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Working Days */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
            <h2 className="text-lg font-bold text-[#10201b]">Working Days</h2>

            <p className="mt-1 text-sm text-gray-500">
              Select the days when you accept bookings.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {DAYS.map((day) => {
                const currentDay = schedule.find(
                  (item) => item.dayOfWeek === day.dayOfWeek,
                );

                const active = currentDay?.enabled ?? false;

                return (
                  <button
                    key={day.dayOfWeek}
                    type="button"
                    onClick={() => toggleDay(day.dayOfWeek)}
                    aria-pressed={active}
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

                    <p className="mt-2 text-sm font-semibold">{day.short}</p>

                    <p className="mt-1 text-[11px] text-gray-400">
                      {day.label}
                    </p>
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              {selectedDaysCount === 0
                ? "No working days selected."
                : `${selectedDaysCount} ${
                    selectedDaysCount === 1 ? "day" : "days"
                  } selected.`}
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
                  Set the start and end time for each working day.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-5 sm:p-6">
            {schedule.map((day) => {
              const dayInfo = DAYS.find(
                (item) => item.dayOfWeek === day.dayOfWeek,
              );

              return (
                <div
                  key={day.dayOfWeek}
                  className={`rounded-2xl border p-4 transition ${
                    day.enabled
                      ? "border-[#d7e6df] bg-[#fbfdfc]"
                      : "border-gray-100 bg-gray-50/70"
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                            day.enabled
                              ? "bg-[#e5f0ec] text-[#146356]"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {dayInfo?.short?.charAt(0)}
                        </span>

                        <div>
                          <p className="font-semibold text-[#10201b]">
                            {dayInfo?.label}
                          </p>

                          <p className="text-xs text-gray-500">
                            {day.enabled
                              ? "Available for bookings"
                              : "Not accepting bookings"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="w-full sm:w-auto">
                        <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                          Start
                        </label>

                        <input
                          type="time"
                          value={day.startTime}
                          disabled={!day.enabled}
                          onChange={(event) =>
                            updateStartTime(day.dayOfWeek, event.target.value)
                          }
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#146356] focus:ring-2 focus:ring-[#146356]/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 sm:w-[150px]"
                        />
                      </div>

                      <div className="hidden pt-5 text-sm text-gray-400 sm:block">
                        to
                      </div>

                      <div className="w-full sm:w-auto">
                        <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                          End
                        </label>

                        <input
                          type="time"
                          value={day.endTime}
                          disabled={!day.enabled}
                          onChange={(event) =>
                            updateEndTime(day.dayOfWeek, event.target.value)
                          }
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#146356] focus:ring-2 focus:ring-[#146356]/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 sm:w-[150px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save */}
        <div className="flex flex-col gap-3 pb-8 sm:flex-row sm:items-center sm:justify-end">
          {saved && (
            <div className="flex items-center gap-2 text-sm font-medium text-green-600 sm:mr-auto">
              <Check size={16} />
              Changes saved successfully
            </div>
          )}

          <button
            type="button"
            onClick={handleSaveSchedule}
            disabled={availabilitySaving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#146356] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#105448] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {availabilitySaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}

            {availabilitySaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
