"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Lock } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const validateForm = () => {
    if (!email) {
      setError("Email is missing");
      return false;
    }

    if (!password.trim()) {
      setError("Password is required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (!confirmPassword.trim()) {
      setError("Please confirm your password");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (loading) return;

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");

      await axios.post("/api/auth/reset-password", {
        email,
        password,
      });

      router.push("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setError("Unable to connect to the server. Please try again.");
        } else {
          setError(error.response?.data?.message || "Failed to reset password");
        }
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleResetPassword();
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center bg-[#F8F5F0] p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#E7DED2] bg-[#FFFDF9] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Header */}
          <div>
            <h2 className="text-[28px] font-bold text-gray-900">
              Reset Password
            </h2>

            <p className="text-sm text-[#6B5D4D]">
              Create a new password for your account
            </p>

            {email && (
              <p className="mt-2 text-sm font-semibold text-[#4361ee] break-all">
                {email}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#6B5D4D]">
              New Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9A8A79]" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full rounded-xl border border-[#E7DED2] bg-white py-3 pl-10 pr-10 text-gray-900 outline-none transition placeholder:text-[#B0A292] focus:border-[#C8A56A] focus:ring-4 focus:ring-[#F4E8D6]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8A79]"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#6B5D4D]">
              Confirm Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9A8A79]" />

              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full rounded-xl border border-[#E7DED2] bg-white py-3 pl-10 pr-4 text-gray-900 outline-none transition placeholder:text-[#B0A292] focus:border-[#C8A56A] focus:ring-4 focus:ring-[#F4E8D6]"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">
              <AlertCircle className="size-4 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#D8B67C] to-[#C8A56A] py-3 font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-75"
          >
            {loading ? "Updating Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
