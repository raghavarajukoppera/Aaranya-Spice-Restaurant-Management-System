import type { ReactNode } from "react";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function WaiterLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute role="waiter">{children}</ProtectedRoute>;
}
