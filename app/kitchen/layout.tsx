import type { ReactNode } from "react";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function KitchenLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute role="kitchen">{children}</ProtectedRoute>;
}
