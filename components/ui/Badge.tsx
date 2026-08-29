import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "green" | "red" | "yellow" | "blue" | "neutral" | "spice";

const toneClasses: Record<BadgeTone, string> = {
  green: "bg-leaf-500/15 text-leaf-600 border-leaf-500/30",
  red: "bg-maroon-600/15 text-maroon-600 border-maroon-600/30",
  yellow: "bg-saffron-500/20 text-saffron-600 border-saffron-500/40",
  blue: "bg-sky-500/15 text-sky-700 border-sky-500/30",
  neutral: "bg-ink/10 text-ink border-ink/20",
  spice: "bg-spice-500/15 text-spice-600 border-spice-500/30",
};

export default function Badge({
  children,
  tone = "neutral",
  className,
  dot,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "green" && "bg-leaf-500",
            tone === "red" && "bg-maroon-600",
            tone === "yellow" && "bg-saffron-500",
            tone === "blue" && "bg-sky-500",
            tone === "neutral" && "bg-ink/50",
            tone === "spice" && "bg-spice-500"
          )}
        />
      )}
      {children}
    </span>
  );
}
