import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface WorkerLayoutProps {
  children: ReactNode;
}
export default function WorkerLayout({ children }: WorkerLayoutProps) {
  return (
    <div className="flex flex-1">
      {/* Sidebar */}
      <Sidebar />
      {/* Page Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
    </div>
  );
}
