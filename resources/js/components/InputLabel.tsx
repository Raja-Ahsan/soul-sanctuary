import { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function InputLabel({
  value,
  className = "",
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
  return (
    <label
      {...props}
      className={cn(
        "block text-xs font-semibold uppercase tracking-widest text-muted-foreground",
        className,
      )}
    >
      {value ? value : children}
    </label>
  );
}
