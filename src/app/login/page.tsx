  "use client";

  import { useState } from "react";
  import { FcGoogle } from "react-icons/fc";
  import axios from "axios";
  import { useRouter } from "next/navigation";
  import Link from "next/link";
  import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";

  export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    const [error, setError] = useState("");

    const validateForm = () => {
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

      return true;
    };

    const handleLogin = async () => {
      if (loading) return;

      if (!validateForm()) return;

      try {
        setLoading(true);
        setError("");

        const { data } = await axios.post("/api/auth/login", {
          email,
          password,
        });

        localStorage.setItem("token", data.token);

        window.dispatchEvent(new Event("auth-change"));

        router.push("/dashboard/customer");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (!error.response) {
            setError("Unable to connect to the server. Please try again.");
          } else {
            setError(error.response.data?.message || "Login failed");
          }
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    const handleForgotPassword = async () => {
      if (otpLoading) return;

      try {
        setError("");

        if (!email.trim()) {
          setError("Please enter your email first");
          return;
        }

        const emailRegex = /\S+@\S+\.\S+/;

        if (!emailRegex.test(email)) {
          setError("Please enter a valid email address");
          return;
        }

        setOtpLoading(true);

        await axios.post("/api/auth/send-otp", {
          email,
        });

        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Failed to send OTP");
        } else {
          setError("Failed to send OTP");
        }
      } finally {
        setOtpLoading(false);
      }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await handleLogin();
    };

    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-[#F8F5F0]">
        <div className="w-full max-w-md rounded-3xl border border-[#E7DED2] bg-[#FFFDF9] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Header */}
            <div>
              <h2 className="text-[28px] font-bold text-gray-900">
                Welcome Back
              </h2>

              <p className="text-sm text-[#6B5D4D]">
                Sign in to your account to continue
              </p>
            </div>

            {/* Google Login */}
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

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#6B5D4D]">
                Email Address
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
                  autoComplete="current-password"
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

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">
                <AlertCircle className="size-4 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="size-4 rounded accent-[#C8A56A]"
                />

                <span className="text-sm text-[#6B5D4D]">Remember me</span>
              </label>

              <button
                type="button"
                disabled={otpLoading}
                onClick={handleForgotPassword}
                className="text-sm font-medium text-[#4361ee] hover:underline disabled:opacity-60"
              >
                {otpLoading ? "Sending OTP..." : "Forgot password?"}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#D8B67C] to-[#C8A56A] py-3 font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-75"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            {/* Register */}
            <p className="text-center text-sm text-[#6B5D4D]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#4361ee] hover:underline"
              >
                Register →
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
