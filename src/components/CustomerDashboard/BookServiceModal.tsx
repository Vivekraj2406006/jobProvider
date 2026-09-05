"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Loader2,
  MapPin,
  Plus,
  X,
} from "lucide-react";

import {
  getServicePackages,
  ServicePackage,
} from "@/lib/api/servicePackageApi";

import { getAddresses } from "@/lib/api/addressApi";
import type { Address } from "@/types/address";

import { createBooking } from "@/lib/api/bookingApi";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category?: string | null;
  imageUrl?: string | null;
}

interface BookServiceModalProps {
  service: Service;
  onClose: () => void;
}

type BookingStep = 1 | 2 | 3;

interface DateOption {
  date: Date;
  value: string;
  label: string;
  day: string;
}

export default function BookServiceModal({
  service,
  onClose,
}: BookServiceModalProps) {
  const [step, setStep] = useState<BookingStep>(1);

  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(
    null,
  );

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [description, setDescription] = useState("");

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /*
   * Generate the next 7 available dates.
   *
   * For now this is a simple date selector.
   * Later we will connect this to actual worker availability.
   */
  const dateOptions = useMemo<DateOption[]>(() => {
    const options: DateOption[] = [];

    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);

      date.setDate(today.getDate() + i);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const dayNumber = String(date.getDate()).padStart(2, "0");

      options.push({
        date,
        value: `${year}-${month}-${dayNumber}`,
        label: date.toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        }),
        day:
          i === 0
            ? "Today"
            : i === 1
              ? "Tomorrow"
              : date.toLocaleDateString("en-IN", {
                  weekday: "short",
                }),
      });
    }

    return options;
  }, []);

  /*
   * Temporary time slots.
   *
   * These are NOT worker-specific yet.
   * Later we will generate these from worker availability
   * and existing bookings.
   */
  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  /*
   * Load packages and addresses.
   */
  useEffect(() => {
    async function loadData() {
      try {
        setError("");

        const [packageData, addressData] = await Promise.all([
          getServicePackages(service.id),
          getAddresses(),
        ]);

        setPackages(packageData);
        setAddresses(addressData);

        if (packageData.length > 0) {
          setSelectedPackage(packageData[0]);
        }

        const defaultAddress =
          addressData.find((address) => address.isDefault) ?? addressData[0];

        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      } catch (err) {
        console.error("Failed to load booking data:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load booking information",
        );
      } finally {
        setLoadingPackages(false);
        setLoadingAddresses(false);
      }
    }

    loadData();
  }, [service.id]);

  /*
   * Validate Step 1.
   */
  const handlePackageAddressContinue = () => {
    setError("");

    if (!selectedPackage) {
      setError("Please select a package.");
      return;
    }

    if (!selectedAddress) {
      setError("Please select an address.");
      return;
    }

    if (!description.trim()) {
      setError("Please describe the issue or service requirement.");
      return;
    }

    setStep(2);
  };

  /*
   * Validate Step 2.
   */
  const handleDateTimeContinue = () => {
    setError("");

    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }

    if (!selectedTime) {
      setError("Please select a time slot.");
      return;
    }

    setStep(3);
  };

  /*
   * Go back to previous step.
   */
  const handleBack = () => {
    setError("");

    if (step === 2) {
      setStep(1);
      return;
    }

    if (step === 3) {
      setStep(2);
    }
  };

  /*
   * Convert selected date + time into an ISO datetime.
   *
   * Example:
   * 2026-09-04 + 11:00
   */
  const getStartDateTime = () => {
    if (!selectedDate || !selectedTime) {
      return null;
    }

    const [hours, minutes] = selectedTime.split(":").map(Number);

    const date = new Date(`${selectedDate}T00:00:00`);

    date.setHours(hours, minutes, 0, 0);

    return date;
  };

  /*
   * Create the actual booking.
   */
  const handleConfirmBooking = async () => {
    setError("");

    if (!selectedPackage) {
      setError("Please select a package.");
      return;
    }

    if (!selectedAddress) {
      setError("Please select an address.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      setError("Please select a date and time.");
      return;
    }

    const startDateTime = getStartDateTime();

    if (!startDateTime) {
      setError("Invalid date or time.");
      return;
    }

    try {
      setLoading(true);

      await createBooking({
        serviceId: service.id,
        packageId: selectedPackage.id,
        addressId: selectedAddress.id,
        scheduledDate: `${selectedDate}T00:00:00`,
        startTime: startDateTime.toISOString(),
        notes: description.trim(),
      });

      alert("Booking confirmed successfully!");

      onClose();
    } catch (err) {
      console.error("Booking creation error:", err);

      setError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  /*
   * Add address using existing address management page.
   */
  const handleAddAddress = () => {
    window.location.href = "/customer/addresses";
  };

  /*
   * Format selected date for summary.
   */
  const formattedSelectedDate = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  /*
   * Format selected time for summary.
   */
  const formattedSelectedTime = selectedTime
    ? new Date(`1970-01-01T${selectedTime}:00`).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Book Service</p>

            <h2 className="text-xl font-bold text-gray-900">{service.name}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* PROGRESS */}
        <div className="border-b px-6 py-4">
          <div className="flex items-center">
            {[1, 2, 3].map((item) => {
              const active = step >= item;

              return (
                <div
                  key={item}
                  className="flex flex-1 items-center last:flex-none"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      active
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {item}
                  </div>

                  {item < 3 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 ${
                        step > item ? "bg-green-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-2 grid grid-cols-3 text-xs font-medium">
            <span className={step >= 1 ? "text-green-700" : "text-gray-400"}>
              Package
            </span>

            <span className={step >= 2 ? "text-green-700" : "text-gray-400"}>
              Date & Time
            </span>

            <span
              className={`text-right ${
                step >= 3 ? "text-green-700" : "text-gray-400"
              }`}
            >
              Confirm
            </span>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* CONTENT */}
        <div className="overflow-y-auto px-6 py-5">
          {/* ================================= */}
          {/* STEP 1 */}
          {/* ================================= */}

          {step === 1 && (
            <>
              {/* PACKAGE */}
              <section>
                <div className="mb-3">
                  <h3 className="text-base font-bold text-gray-900">
                    1. Choose a package
                  </h3>

                  <p className="text-sm text-gray-500">
                    Select the package that suits your requirement.
                  </p>
                </div>

                {loadingPackages ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-gray-500" size={24} />
                  </div>
                ) : packages.length === 0 ? (
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                    No packages are available for this service.
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {packages.map((pkg) => {
                      const isSelected = selectedPackage?.id === pkg.id;

                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setSelectedPackage(pkg)}
                          className={`relative rounded-xl border p-4 text-left transition ${
                            isSelected
                              ? "border-green-600 bg-green-50 ring-2 ring-green-200"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
                              <Check size={14} />
                            </span>
                          )}

                          <h4 className="font-bold text-gray-900">
                            {pkg.name}
                          </h4>

                          <p className="mt-2 text-xl font-bold text-gray-900">
                            ₹{pkg.price}
                          </p>

                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                            <Clock3 size={13} />
                            {pkg.durationMin} minutes
                          </div>

                          {pkg.description && (
                            <p className="mt-3 text-xs leading-5 text-gray-600">
                              {pkg.description}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* ADDRESS */}
              <section className="mt-7">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      2. Select address
                    </h3>

                    <p className="text-sm text-gray-500">
                      Where should the professional provide the service?
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddAddress}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Plus size={16} />
                    Add Address
                  </button>
                </div>

                {loadingAddresses ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-gray-500" size={24} />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                    <MapPin size={28} className="mx-auto mb-2 text-gray-400" />

                    <p className="font-medium text-gray-800">
                      No saved addresses
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Add an address before booking.
                    </p>

                    <button
                      type="button"
                      onClick={handleAddAddress}
                      className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => {
                      const isSelected = selectedAddress?.id === address.id;

                      return (
                        <button
                          key={address.id}
                          type="button"
                          onClick={() => setSelectedAddress(address)}
                          className={`relative w-full rounded-xl border p-4 text-left transition ${
                            isSelected
                              ? "border-green-600 bg-green-50 ring-2 ring-green-200"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                isSelected
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              <MapPin size={18} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-bold text-gray-900">
                                  {address.label}
                                </h4>

                                {address.isDefault && (
                                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                    Default
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 text-sm font-medium text-gray-800">
                                {address.name}
                              </p>

                              <p className="mt-1 text-sm leading-5 text-gray-600">
                                {address.addressLine}
                                {address.area && `, ${address.area}`}
                                {`, ${address.city}`}
                                {`, ${address.state}`}
                                {` - ${address.pincode}`}
                              </p>

                              <p className="mt-2 text-xs text-gray-500">
                                Phone: {address.phone}
                              </p>
                            </div>

                            <div
                              className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                isSelected
                                  ? "border-green-600 bg-green-600 text-white"
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && <Check size={12} />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* DESCRIPTION */}
              <section className="mt-7">
                <h3 className="mb-1 text-base font-bold text-gray-900">
                  3. Describe your requirement
                </h3>

                <p className="mb-3 text-sm text-gray-500">
                  Tell the professional what you need help with.
                </p>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder={`Example: My ${service.name.toLowerCase()} is not working properly...`}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                />
              </section>
            </>
          )}

          {/* ================================= */}
          {/* STEP 2 - DATE & TIME */}
          {/* ================================= */}

          {step === 2 && (
            <>
              <section>
                <div className="mb-5">
                  <div className="mb-1 flex items-center gap-2">
                    <CalendarDays size={19} />
                    <h3 className="text-base font-bold text-gray-900">
                      Select date
                    </h3>
                  </div>

                  <p className="text-sm text-gray-500">
                    Choose a convenient day for your service.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {dateOptions.map((option) => {
                    const isSelected = selectedDate === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSelectedDate(option.value);
                          setSelectedTime("");
                        }}
                        className={`rounded-xl border p-4 text-center transition ${
                          isSelected
                            ? "border-green-600 bg-green-50 ring-2 ring-green-200"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <p
                          className={`text-xs font-semibold ${
                            isSelected ? "text-green-700" : "text-gray-500"
                          }`}
                        >
                          {option.day}
                        </p>

                        <p className="mt-1 font-bold text-gray-900">
                          {option.label}
                        </p>

                        {isSelected && (
                          <Check
                            size={15}
                            className="mx-auto mt-2 text-green-600"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* TIME */}
              <section className="mt-8">
                <div className="mb-5">
                  <div className="mb-1 flex items-center gap-2">
                    <Clock3 size={19} />
                    <h3 className="text-base font-bold text-gray-900">
                      Select time
                    </h3>
                  </div>

                  <p className="text-sm text-gray-500">
                    Choose your preferred service time.
                  </p>
                </div>

                {!selectedDate ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
                    Please select a date first.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {timeSlots.map((time) => {
                      const isSelected = selectedTime === time;

                      const [hour, minute] = time.split(":").map(Number);

                      const formattedTime = new Date(
                        1970,
                        0,
                        1,
                        hour,
                        minute,
                      ).toLocaleTimeString("en-IN", {
                        hour: "numeric",
                        minute: "2-digit",
                      });

                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                            isSelected
                              ? "border-green-600 bg-green-50 text-green-700 ring-2 ring-green-200"
                              : "border-gray-200 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {formattedTime}
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}

          {/* ================================= */}
          {/* STEP 3 - CONFIRMATION */}
          {/* ================================= */}

          {step === 3 && (
            <section>
              <div className="mb-5">
                <h3 className="text-lg font-bold text-gray-900">
                  Confirm your booking
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Review your booking details before confirming.
                </p>
              </div>

              <div className="space-y-4">
                {/* SERVICE */}
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Service
                  </p>

                  <div className="mt-1 flex items-center justify-between gap-4">
                    <p className="font-bold text-gray-900">{service.name}</p>

                    <p className="font-bold text-gray-900">
                      ₹{selectedPackage?.price}
                    </p>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {selectedPackage?.name} · {selectedPackage?.durationMin}{" "}
                    minutes
                  </p>
                </div>

                {/* ADDRESS */}
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Service address
                  </p>

                  {selectedAddress && (
                    <>
                      <p className="mt-1 font-bold text-gray-900">
                        {selectedAddress.label}
                      </p>

                      <p className="mt-1 text-sm leading-5 text-gray-600">
                        {selectedAddress.addressLine}
                        {selectedAddress.area && `, ${selectedAddress.area}`}
                        {`, ${selectedAddress.city}`}
                        {`, ${selectedAddress.state}`}
                        {` - ${selectedAddress.pincode}`}
                      </p>
                    </>
                  )}
                </div>

                {/* DATE & TIME */}
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Schedule
                  </p>

                  <div className="mt-2 flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                      <CalendarDays size={16} />
                      <span className="text-sm font-medium text-gray-800">
                        {formattedSelectedDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                      <Clock3 size={16} />
                      <span className="text-sm font-medium text-gray-800">
                        {formattedSelectedTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* REQUIREMENT */}
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Requirement
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {description}
                  </p>
                </div>

                {/* TOTAL */}
                <div className="rounded-xl bg-gray-900 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Total amount</span>

                    <span className="text-2xl font-bold">
                      ₹{selectedPackage?.price}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-400">
                    No platform fee or discount applied yet.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t bg-white px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>

            <div>
              {step === 1 && (
                <button
                  type="button"
                  onClick={handlePackageAddressContinue}
                  disabled={
                    loading ||
                    loadingPackages ||
                    loadingAddresses ||
                    !selectedPackage ||
                    !selectedAddress
                  }
                  className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  onClick={handleDateTimeContinue}
                  disabled={!selectedDate || !selectedTime}
                  className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Review Booking
                </button>
              )}

              {step === 3 && (
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={loading}
                  className="rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Confirming...
                    </span>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
