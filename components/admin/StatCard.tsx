import { LucideIcon } from "lucide-react";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "spice" | "saffron" | "leaf" | "maroon";
  trend?: string;
}

const toneClasses: Record<string, string> = {
  spice: "bg-spice-500/12 text-spice-600",
  saffron: "bg-saffron-500/15 text-saffron-600",
  leaf: "bg-leaf-500/12 text-leaf-600",
  maroon: "bg-maroon-600/12 text-maroon-600",
};

export default function StatCard({ label, value, icon: Icon, tone = "spice", trend }: StatCardProps) {
  return (
    <Card hover className="animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink/45">{label}</p>
          <p className="mt-2 font-display text-2xl font-semibold text-ink">{value}</p>
          {trend && <p className="mt-1 text-xs font-medium text-leaf-600">{trend}</p>}
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", toneClasses[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
