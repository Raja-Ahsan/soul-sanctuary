import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  trend?: { label: string; positive?: boolean };
}) {
  return (
    <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 font-serif text-3xl text-navy sm:text-4xl">{value}</p>
            {hint ? (
              <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
            ) : null}
            {trend ? (
              <p
                className={cn(
                  "mt-3 text-xs font-semibold",
                  trend.positive === false ? "text-destructive" : "text-navy",
                )}
              >
                <span className="text-gold">{trend.positive === false ? "↓" : "↑"}</span>{" "}
                {trend.label}
              </p>
            ) : null}
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-soft">
            <Icon className="h-5 w-5 text-gold" strokeWidth={2.25} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
