"use client";

import Link from "next/link";
import { Receipt, UtensilsCrossed, ChefHat, Grid3x3, Users } from "lucide-react";
import Card from "@/components/ui/Card";

const ACTIONS = [
  { label: "Generate Bill", href: "/admin/billing", icon: Receipt, tone: "bg-spice-500" },
  { label: "Manage Menu", href: "/admin/menu", icon: UtensilsCrossed, tone: "bg-saffron-500" },
  { label: "View Kitchen", href: "/admin/kitchen", icon: ChefHat, tone: "bg-maroon-600" },
  { label: "View Tables", href: "/admin/tables", icon: Grid3x3, tone: "bg-leaf-500" },
  { label: "Manage Staff", href: "/admin/staff", icon: Users, tone: "bg-spice-700" },
];

export default function QuickActions() {
  return (
    <Card className="animate-fade-in">
      <h3 className="mb-4 font-display text-base font-semibold text-ink">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.label}
              href={a.href}
              className="group flex flex-col items-center gap-2 rounded-xl border border-spice-100 bg-white/50 p-4 text-center transition-all hover:-translate-y-0.5 hover:border-spice-300 hover:shadow-card"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white transition-transform group-hover:scale-105 ${a.tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-ink/75">{a.label}</span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
