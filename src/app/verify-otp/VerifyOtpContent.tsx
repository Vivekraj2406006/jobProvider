"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!email) {
      router.replace("/login");
    }
  }, [email, router]);

  const validateOtp = () => {
    if (!otp.trim()) {
      setError("Please enter OTP");
      return false;
    }

    if (otp.length !== 6) {
      setError("OTP must be exactly 6 digits");
      return false;
    }

    return true;
  };

  const handleVerifyOtp = async () => {
    if (loading) return;

    if (!validateOtp()) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await axios.post("/api/auth/verify-otp", {
        email,
        otp,
      });

      router.replace(`/reset-password?email=${encodeURIComponent(email!)}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setError("Unable to connect to the server. Please try again.");
        } else {
          setError(error.response?.data?.message || "OTP verification failed");
        }
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resending) return;

    try {
      setResending(true);
      setError("");
      setSuccess("");

      await axios.post("/api/auth/send-otp", {
        email,
      });

      setSuccess("A new OTP has been sent to your email.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setError("Unable to connect to the server. Please try again.");
        } else {
          setError(error.response?.data?.message || "Failed to resend OTP");
        }
      } else {
        setError("Failed to resend OTP");
      }
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleVerifyOtp();
  };

  if (!email) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F8F5F0] p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#E7DED2] bg-[#FFFDF9] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Header */}
          <div>
            <h2 className="text-center text-[28px] font-bold text-gray-900">
              Verify OTP
            </h2>

            <p className="mt-2 text-center text-sm text-[#6B5D4D]">
              Enter the OTP sent to
            </p>

            <p className="mt-1 break-all text-center text-sm font-semibold text-[#4361ee]">
              {email}
            </p>
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F4E8D6]">
              <ShieldCheck size={30} className="text-[#C8A56A]" />
            </div>
          </div>

          {/* OTP Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#6B5D4D]">
              OTP Code
            </label>

            <input
              autoFocus
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit OTP"
              autoComplete="one-time-code"
              className="w-full rounded-xl border border-[#E7DED2] bg-white py-3 text-center text-xl font-bold tracking-[8px] text-gray-900 outline-none transition placeholder:text-[#B0A292] focus:border-[#C8A56A] focus:ring-4 focus:ring-[#F4E8D6]"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">
              <AlertCircle className="size-4 shrink-0" />

              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-green-600">
              <CheckCircle2 className="size-4 shrink-0" />

              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading || resending}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#D8B67C] to-[#C8A56A] py-3 font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-75"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {/* Resend OTP */}
          <button
            type="button"
            disabled={resending || loading}
            onClick={handleResendOtp}
            className="text-center text-sm font-medium text-[#4361ee] hover:underline disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
