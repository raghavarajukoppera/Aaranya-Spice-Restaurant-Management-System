"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, Lock, User as UserIcon, ShieldCheck, UtensilsCrossed, Soup, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { dashboardPathForRole } from "@/lib/auth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Role } from "@/lib/types";

const ROLE_TABS: { role: Role; label: string; icon: typeof ShieldCheck }[] = [
  { role: "admin", label: "Admin", icon: ShieldCheck },
  { role: "waiter", label: "Waiter", icon: UtensilsCrossed },
  { role: "kitchen", label: "Kitchen", icon: Soup },
  { role: "counter", label: "Counter", icon: Package },
];

export default function LoginPage() {
  const { user, isHydrated, login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<Role>("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isHydrated && user) {
      router.replace(dashboardPathForRole(user.role));
    }
  }, [isHydrated, user, router]);

  function handleSelectRole(role: Role) {
    setSelectedRole(role);
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 450));
    const matched = login(username, password, selectedRole);
    setSubmitting(false);
    if (!matched) {
      setError(`Incorrect username or password for the ${ROLE_TABS.find((r) => r.role === selectedRole)?.label} portal.`);
      return;
    }
    showToast(`Welcome back, ${matched.name.split(" ")[0]}!`, "success");
    router.replace(dashboardPathForRole(matched.role));
  }

  const activeTab = ROLE_TABS.find((r) => r.role === selectedRole)!;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-saffron-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-spice-500/15 blur-3xl" />

      <div className="relative w-full max-w-5xl grid overflow-hidden rounded-xl2 shadow-glass glass-strong md:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden p-10 text-white md:flex">
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=900&q=80"
            alt="Indian thali spread at Aaranya Spice"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-maroon-700/92 via-spice-600/85 to-spice-500/75" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <ChefHat className="h-6 w-6" />
            </div>
            <span className="font-display text-2xl font-semibold">Aaranya Spice</span>
          </div>

          <div className="relative animate-fade-in">
            <p className="font-display text-3xl italic leading-snug">
              "Where Every Meal Feels Like Home"
            </p>
            <p className="mt-4 max-w-sm text-sm text-white/75">
              A single, elegant workspace for your floor, your kitchen, and your books —
              built for the rhythm of a real dinner service.
            </p>
          </div>

          <div className="relative flex gap-6 text-xs text-white/60">
            <span>12 Tables</span>
            <span>·</span>
            <span>Live Kitchen Sync</span>
            <span>·</span>
            <span>Instant Billing</span>
          </div>
        </div>

        {/* Form panel */}
        <div className="p-8 sm:p-10">
          <div className="mb-6 -mx-8 -mt-8 h-32 overflow-hidden sm:-mx-10 sm:-mt-10 md:hidden">
            <img
              src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=900&q=80"
              alt="Indian thali spread at Aaranya Spice"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mb-8 flex items-center gap-2.5 md:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-spice-500 text-white">
              <ChefHat className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-semibold text-maroon-700">
              Aaranya Spice
            </span>
          </div>

          <h1 className="font-display text-2xl font-semibold text-ink">Sign in</h1>
          <p className="mt-1 text-sm text-ink/50">
            Choose your portal, then enter your own username and password.
          </p>

          {/* Role selector — picks which portal you're signing into, does NOT fill credentials */}
          <div className="mt-6 grid grid-cols-4 gap-2" role="tablist" aria-label="Select portal">
            {ROLE_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = selectedRole === tab.role;
              return (
                <button
                  key={tab.role}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSelectRole(tab.role)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition-all focus-ring ${
                    active
                      ? "border-spice-500 bg-spice-500/10 text-spice-600"
                      : "border-spice-200 bg-white/50 text-ink/60 hover:bg-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              id="username"
              label={`${activeTab.label} Username`}
              placeholder="Enter your username"
              icon={<UserIcon className="h-4 w-4" />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            {error && (
              <p className="rounded-lg bg-maroon-600/10 px-3 py-2 text-xs font-medium text-maroon-600 animate-fade-in">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" loading={submitting}>
              Sign in to {activeTab.label} Portal
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
