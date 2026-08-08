import { ReactNode } from "react";
import WorkerLayout from "@/components/worker/layout/WorkerLayout";
interface LayoutProps {
  children: ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  return <WorkerLayout>{children}</WorkerLayout>;
}
