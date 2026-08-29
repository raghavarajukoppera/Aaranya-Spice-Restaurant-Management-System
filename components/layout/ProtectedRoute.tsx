"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/lib/types";
import { dashboardPathForRole } from "@/lib/auth";
import { ChefHat } from "lucide-react";

export default function ProtectedRoute({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const { user, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.replace("/login");
    } else if (user.role !== role) {
      router.replace(dashboardPathForRole(user.role));
    }
  }, [isHydrated, user, role, router]);

  if (!isHydrated || !user || user.role !== role) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-spice-50">
        <ChefHat className="h-8 w-8 animate-pulse text-spice-500" />
        <p className="text-sm font-medium text-ink/50">Loading Aaranya Spice…</p>
      </div>
    );
  }

  return <>{children}</>;
}
