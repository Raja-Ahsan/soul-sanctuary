import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function SecondaryButton({
  className = "",
  disabled,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-navy transition hover:border-gold/50 hover:bg-gold-soft/40 focus:outline-none focus:ring-2 focus:ring-gold/30 disabled:opacity-50",
        className,
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
