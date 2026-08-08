"use client";

import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff, UserRound, Lock, Mail, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export default function Page() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const validateForm = () => {
    if (!name.trim()) {
      setError("Name is required");
      return false;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return false;
    }

    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
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

    return true;
  };

  const handleRegister = async () => {
    if (loading) return;

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");

      await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      router.push("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setError("Unable to connect to the server. Please try again.");
        } else {
          setError(error.response?.data?.message || "Registration failed");
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
    await handleRegister();
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-[#F8F5F0] p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#E7DED2] bg-[#FFFDF9] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Header */}
          <div>
            <h2 className="text-[28px] font-bold text-gray-900">
              Create Account
            </h2>

            <p className="text-sm text-[#6B5D4D]">
              Sign up to create your account
            </p>
          </div>

          {/* Google Signup */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#E7DED2] bg-white py-3 text-gray-800 transition hover:bg-[#F7F2EB]"
          >
            <FcGoogle size={30} />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#E7DED2]" />

            <span className="text-xs font-medium text-[#9A8A79]">OR</span>

            <div className="h-px flex-1 bg-[#E7DED2]" />
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#6B5D4D]">Name</label>

            <div className="relative">
              <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9A8A79]" />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                autoComplete="name"
                className="w-full rounded-xl border border-[#E7DED2] bg-white py-3 pl-10 pr-4 text-gray-900 outline-none transition placeholder:text-[#B0A292] focus:border-[#C8A56A] focus:ring-4 focus:ring-[#F4E8D6]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#6B5D4D]">
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9A8A79]" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-[#E7DED2] bg-white py-3 pl-10 pr-4 text-gray-900 outline-none transition placeholder:text-[#B0A292] focus:border-[#C8A56A] focus:ring-4 focus:ring-[#F4E8D6]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#6B5D4D]">
              Password
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8A79] transition hover:text-[#6B5D4D]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">
              <AlertCircle className="size-4 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#D8B67C] to-[#C8A56A] py-3 font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-[#6B5D4D]">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#4361ee] hover:underline"
            >
              Sign In →
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
