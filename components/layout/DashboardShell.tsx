import { ReactNode } from "react";
import { Role } from "@/lib/types";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileNav from "./MobileNav";

export default function DashboardShell({
  role,
  title,
  children,
}: {
  role: Role;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar role={role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main className="flex-1 px-3 pb-24 md:pb-6">{children}</main>
        <MobileNav role={role} />
      </div>
    </div>
  );
}
