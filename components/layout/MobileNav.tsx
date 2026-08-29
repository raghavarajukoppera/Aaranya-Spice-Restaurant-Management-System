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
    { label: "Home", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Menu", href: "/admin/menu", icon: UtensilsCrossed },
    { label: "Tables", href: "/admin/tables", icon: Grid3x3 },
    { label: "Billing", href: "/admin/billing", icon: Receipt },
    { label: "Staff", href: "/admin/staff", icon: Users },
  ],
  waiter: [
    { label: "Floor", href: "/waiter/dashboard", icon: Grid3x3 },
  ],
  kitchen: [
    { label: "Kitchen", href: "/kitchen/dashboard", icon: ClipboardList },
  ],
  counter: [
    { label: "Orders", href: "/counter/dashboard", icon: Package },
  ],
};

export default function MobileNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role];

  return (
    <nav
      aria-label="Mobile navigation"
      className="mobile-nav glass-strong fixed inset-x-3 bottom-3 z-40 rounded-2xl px-2 py-2 shadow-glass md:hidden"
    >
      <div className="flex items-stretch justify-around gap-1">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[10px] font-semibold transition-all focus-ring",
                active
                  ? "bg-spice-500 text-white shadow-card"
                  : "text-ink/60 hover:bg-spice-100/70 hover:text-ink"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
