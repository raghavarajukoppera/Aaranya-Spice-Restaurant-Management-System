import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export default function Card({ children, className, hover, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass rounded-xl2 shadow-glass p-5",
        hover && "transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
