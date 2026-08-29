import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, icon, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-medium text-ink/80"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full rounded-xl border border-spice-200 bg-white/70 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 transition-all focus-ring focus:border-spice-400 focus:bg-white",
              icon && "pl-9",
              error && "border-maroon-500",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-maroon-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
