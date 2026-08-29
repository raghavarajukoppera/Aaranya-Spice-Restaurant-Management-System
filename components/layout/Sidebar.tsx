"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Grid3x3,
  Receipt,
  Users,
  ChefHat,
  ClipboardList,
  Package,
} from "lucide-react";
import { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Menu Management", href: "/admin/menu", icon: UtensilsCrossed },
    { label: "Tables", href: "/admin/tables", icon: Grid3x3 },
    { label: "Kitchen View", href: "/admin/kitchen", icon: ChefHat },
    { label: "Billing", href: "/admin/billing", icon: Receipt },
    { label: "Staff", href: "/admin/staff", icon: Users },
  ],
  waiter: [
    { label: "Restaurant Floor", href: "/waiter/dashboard", icon: Grid3x3 },
  ],
  kitchen: [
    { label: "Kitchen Dashboard", href: "/kitchen/dashboard", icon: ClipboardList },
  ],
  counter: [
    { label: "Parcel Orders", href: "/counter/dashboard", icon: Package },
  ],
};

export default function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role];

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:shrink-0 glass-strong m-3 mr-0 rounded-xl2 shadow-glass">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-spice-500 text-white shadow-card">
          <ChefHat className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-lg font-semibold leading-tight text-maroon-700">
            Aaranya Spice
          </p>
          <p className="text-[11px] text-ink/50 tracking-wide">Where every meal feels like home</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-spice-500 text-white shadow-card"
                  : "text-ink/65 hover:bg-spice-100/70 hover:text-ink"
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-5 text-[11px] text-ink/40">
        © {new Date().getFullYear()} Aaranya Spice POS
      </div>
    </aside>
  );
}
