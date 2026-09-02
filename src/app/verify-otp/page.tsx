import { Suspense } from "react";
import VerifyOtpContent from "./VerifyOtpContent";

function VerifyOtpLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F8F5F0] p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#E7DED2] bg-[#FFFDF9] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8">
        <div className="text-center text-sm text-[#6B5D4D]">
          Loading...
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<VerifyOtpLoading />}>
      <VerifyOtpContent />
    </Suspense>
  );
}
