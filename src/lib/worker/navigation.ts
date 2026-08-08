import {
  LayoutDashboard,
  BriefcaseBusiness,
  User,
  Wallet,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface WorkerNavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const workerNavigation: WorkerNavigationItem[] = [
  {
    title: "Dashboard",
    href: "/worker",
    icon: LayoutDashboard,
  },
  {
    title: "Jobs",
    href: "/worker/jobs",
    icon: BriefcaseBusiness,
  },
  {
    title: "Profile",
    href: "/worker/profile",
    icon: User,
  },
  {
    title: "Earnings",
    href: "/worker/earnings",
    icon: Wallet,
  },
  {
    title: "Settings",
    href: "/worker/settings",
    icon: Settings,
  },
];
