import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function PrimaryButton({
  className = "",
  disabled,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-navy-deep focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
