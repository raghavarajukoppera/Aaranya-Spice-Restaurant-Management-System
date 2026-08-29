"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function Topbar({ title }: { title: string }) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleLogout() {
    logout();
    showToast("You've been signed out.", "info");
    router.replace("/login");
  }

  return (
    <header className="glass sticky top-0 z-30 m-3 flex items-center justify-between rounded-xl2 px-5 py-3.5 shadow-glass">
      <div>
        <h1 className="font-display text-xl font-semibold text-maroon-700">{title}</h1>
        <p className="text-xs text-ink/45">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-ink">{user?.name}</p>
          <p className="text-[11px] capitalize text-ink/45">{user?.role}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-spice-500 text-sm font-bold text-white">
          {user?.name?.charAt(0) ?? "?"}
        </div>
        <button
          onClick={() => setConfirmOpen(true)}
          className="flex items-center gap-1.5 rounded-xl border border-spice-200 bg-white/60 px-3 py-2 text-xs font-semibold text-ink/70 transition-colors hover:bg-white hover:text-maroon-600 focus-ring"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Sign out"
        description="You'll need to log in again to access the dashboard. Continue?"
        confirmLabel="Sign out"
        danger
        onConfirm={handleLogout}
      />
    </header>
  );
}
