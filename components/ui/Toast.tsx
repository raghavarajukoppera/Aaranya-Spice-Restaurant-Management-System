"use client";

import { CheckCircle2, Info, TriangleAlert, XCircle, X } from "lucide-react";
import { useToast, ToastType } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

const toneMap: Record<ToastType, { icon: typeof Info; classes: string }> = {
  success: { icon: CheckCircle2, classes: "border-leaf-500/40 text-leaf-600" },
  error: { icon: XCircle, classes: "border-maroon-600/40 text-maroon-600" },
  warning: { icon: TriangleAlert, classes: "border-saffron-500/50 text-saffron-600" },
  info: { icon: Info, classes: "border-spice-400/40 text-spice-600" },
};

export default function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const { icon: Icon, classes } = toneMap[t.type];
        return (
          <div
            key={t.id}
            className={cn(
              "glass-strong animate-slide-in-right flex items-start gap-3 rounded-xl border p-3.5 shadow-glass",
              classes
            )}
            role="status"
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="flex-1 text-sm font-medium text-ink">{t.message}</p>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-ink/40 hover:text-ink focus-ring rounded"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
