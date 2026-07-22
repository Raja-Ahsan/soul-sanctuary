import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function DangerButton({
  className = "",
  disabled,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-destructive px-5 py-2.5 text-sm font-semibold text-destructive-foreground transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-destructive/30 disabled:opacity-50",
        className,
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
