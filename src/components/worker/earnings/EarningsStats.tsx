import {
  Calendar,
  CalendarDays,
  BriefcaseBusiness,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

import EarningsCard from "./EarningsCard";

interface Props {
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  totalEarnings: number;
  totalJobs: number;
  averagePerJob: number;
}

export default function EarningsStats({
  todayEarnings,
  weeklyEarnings,
  monthlyEarnings,
  totalEarnings,
  totalJobs,
  averagePerJob,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <EarningsCard
        title="Today"
        value={`₹${todayEarnings}`}
        icon={Calendar}
        iconColor="bg-green-600"
      />

      <EarningsCard
        title="This Week"
        value={`₹${weeklyEarnings}`}
        icon={CalendarDays}
        iconColor="bg-blue-600"
      />

      <EarningsCard
        title="This Month"
        value={`₹${monthlyEarnings}`}
        icon={IndianRupee}
        iconColor="bg-purple-600"
      />

      <EarningsCard
        title="Total Earnings"
        value={`₹${totalEarnings}`}
        icon={TrendingUp}
        iconColor="bg-orange-600"
      />

      <EarningsCard
        title="Completed Jobs"
        value={totalJobs}
        icon={BriefcaseBusiness}
        iconColor="bg-cyan-600"
      />

      <EarningsCard
        title="Average / Job"
        value={`₹${averagePerJob}`}
        icon={IndianRupee}
        iconColor="bg-pink-600"
      />
    </div>
  );
}
