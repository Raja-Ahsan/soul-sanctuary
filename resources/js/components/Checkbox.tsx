import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function Checkbox({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-border text-navy accent-gold shadow-none focus:ring-gold/40",
        className,
      )}
    />
  );
}
