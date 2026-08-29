import type { ReactNode } from "react";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function CounterLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute role="counter">{children}</ProtectedRoute>;
}
