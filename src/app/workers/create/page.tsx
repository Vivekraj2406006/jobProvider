"use client";

import { useState, useEffect } from "react";
import { State, City } from "country-state-city";
import { useRouter } from "next/navigation";

import {
  MapPin,
  Briefcase,
  FileText,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axios from "axios";

export default function Page() {
  const router = useRouter();
  const skillCategories = {
    "Home Services": [
      "Electrician",
      "Plumber",
      "Carpenter",
      "Painter",
      "Mason",
      "Welder",
      "Gardener",
    ],

    "Repair Services": [
      "AC Repair",
      "Refrigerator Repair",
      "Washing Machine Repair",
      "TV Repair",
      "Mobile Repair",
      "Laptop Repair",
      "Water Purifier Repair",
    ],

    "Beauty & Wellness": [
      "Beautician",
      "Makeup Artist",
      "Hair Stylist",
      "Mehendi Artist",
      "Nail Technician",
      "Spa Therapist",
    ],

    "Cleaning Services": [
      "House Cleaner",
      "Office Cleaner",
      "Deep Cleaning",
      "Bathroom Cleaning",
      "Sofa Cleaning",
    ],

    "Domestic Help": ["Cook", "House Maid", "Babysitter", "Elder Caregiver"],

    Transportation: ["Driver", "Personal Driver", "Delivery Partner"],

    "Education & Training": [
      "Home Tutor",
      "Computer Trainer",
      "Music Teacher",
      "Dance Instructor",
    ],

    "Events & Freelance": [
      "Photographer",
      "Videographer",
      "Event Decorator",
      "DJ",
      "Anchor",
    ],
  };

  const [stateCode, setStateCode] = useState("");
  const [openCategory, setOpenCategory] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState(0);
  const [bio, setBio] = useState("");
  const [availability, setAvailability] = useState(true);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Location Success:", position.coords);

        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error("Location Error Object:", error);
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);

        setError(`Location Error (${error.code}): ${error.message}`);
      },
    );
  }, []);

  const states = State.getStatesOfCountry("IN");

  const cities = stateCode ? City.getCitiesOfState("IN", stateCode) : [];

  const handleWorker = async () => {
    console.log("Submitting...");
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
    if (loading) return;

    try {
      setError("");

      if (skills.length === 0) {
        setError("Please select at least one skill");
        return;
      }

      if (!state || !city || !area.trim() || !pincode) {
        setError("Please fill all location fields");
        return;
      }

      if (latitude === null || longitude === null) {
        setError("Location access is required");
        return;
      }

      if (experience < 0) {
        setError("Experience cannot be negative");
        return;
      }

      if (!/^\d{6}$/.test(pincode)) {
        setError("Please enter a valid 6 digit pincode");
        return;
      }

      if (bio.trim().length < 20) {
        setError("Bio must be at least 20 characters");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first");
        return;
      }

      setLoading(true);

      const { data } = await axios.post(
        "/api/workers/create",
        {
          skills,
          experience,
          bio: bio.trim(),
          availability,
          state,
          city,
          area: area.trim(),
          pincode,
          latitude,
          longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        // Replace the old CUSTOMER token
        localStorage.setItem("token", data.token);

        // Notify other components that auth changed
        window.dispatchEvent(new Event("auth-change"));

        // Go to the worker dashboard
        router.push("/worker");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Failed to create worker profile",
        );
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSkillSelect = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((selectedSkill) => selectedSkill !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };
  console.log("Latitude:", latitude);
  console.log("Longitude:", longitude);

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#F8F5F0] px-4 py-8">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-[#E7DED2] bg-[#FFFDF9] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-[28px] font-bold text-gray-900">
              Become a Worker
            </h2>

            <p className="text-sm text-[#6B5D4D]">
              Create your worker profile and start receiving jobs.
            </p>
          </div>

          {/* Skills */}

          <div className="flex flex-col gap-4">
            <label className="text-xs font-semibold text-[#6B5D4D]">
              Skills
            </label>

            {/* Selected Skills */}

            <div className="rounded-2xl border border-[#E7DED2] bg-[#FDF9F3] p-4">
              <p className="mb-3 text-sm font-semibold text-[#6B5D4D]">
                Selected Skills
              </p>

              <div className="flex flex-wrap gap-2">
                {skills.length === 0 ? (
                  <span className="text-sm text-[#9A8A79]">
                    No skills selected
                  </span>
                ) : (
                  skills.map((skill) => (
                    <div
                      key={skill}
                      className="rounded-full bg-[#D8B67C] px-3 py-1 text-sm font-medium text-white"
                    >
                      {skill}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Categories */}

            <div className="flex flex-col gap-3">
              {Object.entries(skillCategories).map(
                ([category, categorySkills]) => (
                  <div
                    key={category}
                    className="overflow-hidden rounded-2xl border border-[#E7DED2] bg-white"
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between p-4 text-left transition hover:bg-[#F7F2EB]"
                      onClick={() =>
                        setOpenCategory(
                          openCategory === category ? "" : category,
                        )
                      }
                    >
                      <span className="font-semibold text-gray-900">
                        {category}
                      </span>

                      {openCategory === category ? (
                        <ChevronUp size={18} className="text-[#6B5D4D]" />
                      ) : (
                        <ChevronDown size={18} className="text-[#6B5D4D]" />
                      )}
                    </button>

                    {openCategory === category && (
                      <div className="border-t border-[#E7DED2] p-4">
                        <div className="flex flex-wrap gap-3">
                          {categorySkills.map((skill) => (
                            <button
                              key={skill}
                              type="button"
                              value={skill}
                              onClick={() => handleSkillSelect(skill)}
                              className={`rounded-full px-4 py-2 text-sm font-medium transition
                                ${
                                  skills.includes(skill)
                                    ? "bg-[#D8B67C] text-white border-[#D8B67C]"
                                    : "bg-white text-gray-700 border-[#E7DED2] hover:bg-[#F7F2EB]"
                                }`}
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Location */}

          <div className="flex flex-col gap-4">
            <label className="text-xs font-semibold text-[#6B5D4D]">
              Location Details
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              {/* State */}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#6B5D4D]">
                  State
                </label>

                <div className="relative">
                  <select
                    value={state}
                    onChange={(e) => {
                      const selected = states.find(
                        (s) => s.name === e.target.value,
                      );

                      setState(e.target.value);
                      setStateCode(selected?.isoCode || "");
                      setCity("");
                    }}
                    className="w-full rounded-xl border border-[#E7DED2] bg-white py-3 px-4 text-gray-900 outline-none transition focus:border-[#C8A56A] focus:ring-4 focus:ring-[#F4E8D6]"
                  >
                    <option value="">Select State</option>

                    {states.map((stateItem) => (
                      <option key={stateItem.isoCode} value={stateItem.name}>
                        {stateItem.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* City */}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#6B5D4D]">
                  City
                </label>

                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={!stateCode}
                    className="w-full rounded-xl border border-[#E7DED2] bg-white py-3 px-4 text-gray-900 outline-none transition focus:border-[#C8A56A] focus:ring-4 focus:ring-[#F4E8D6]"
                  >
                    <option value="">Select City</option>

                    {cities.map((cityItem) => (
                      <option key={cityItem.name} value={cityItem.name}>
                        {cityItem.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Area */}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#6B5D4D]">
                  Area / Locality
                </label>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9A8A79]" />

                  <input
                    type="text"
                    value={area}
                    onChange={(e) => {
                      setArea(e.target.value);
                    }}
                    placeholder="Sakchi"
                    className="w-full rounded-xl border border-[#E7DED2] bg-white py-3 pl-10 pr-4 text-gray-900 outline-none transition focus:border-[#C8A56A] focus:ring-4 focus:ring-[#F4E8D6]"
                  />
                </div>
              </div>

              {/* Pincode */}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#6B5D4D]">
                  Pin Code
                </label>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9A8A79]" />

                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                    }}
                    placeholder="831001"
                    className="w-full rounded-xl border border-[#E7DED2] bg-white py-3 pl-10 pr-4 text-gray-900 outline-none transition focus:border-[#C8A56A] focus:ring-4 focus:ring-[#F4E8D6]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Experience */}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#6B5D4D]">
              Experience (Years)
            </label>

            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9A8A79]" />

              <input
                type="number"
                value={experience}
                onChange={(e) => {
                  const value = e.target.value;
                  setExperience(value === "" ? 0 : Number(value));
                }}
                placeholder="Enter years of experience"
                className="w-full rounded-xl border border-[#E7DED2] bg-white py-3 pl-10 pr-4 text-gray-900 outline-none transition focus:border-[#C8A56A] focus:ring-4 focus:ring-[#F4E8D6]"
              />
            </div>
          </div>

          {/* Bio */}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#6B5D4D]">Bio</label>

            <div className="relative">
              <FileText className="absolute left-3 top-4 size-4 text-[#9A8A79]" />

              <textarea
                rows={5}
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                }}
                placeholder="Tell customers about your experience and services..."
                className="w-full resize-none rounded-xl border border-[#E7DED2] bg-white py-3 pl-10 pr-4 text-gray-900 outline-none transition focus:border-[#C8A56A] focus:ring-4 focus:ring-[#F4E8D6]"
              />
            </div>
          </div>

          {/* Availability */}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={availability}
              onChange={(e) => {
                setAvailability(e.target.checked);
              }}
              className="size-4"
            />

            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-[#C8A56A]" />

              <span className="text-sm text-[#6B5D4D]">Available for jobs</span>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={handleWorker}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#D8B67C] to-[#C8A56A] py-3 font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Profile..." : "Create Worker Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
