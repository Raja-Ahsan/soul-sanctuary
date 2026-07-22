import { Link, router, usePage } from "@inertiajs/react";
import { Bell, LogOut, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { PageProps } from "@/types";

export function DashboardHeader({
  title,
  description,
  onMenuClick,
}: {
  title: string;
  description?: string;
  onMenuClick: () => void;
}) {
  const { auth } = usePage<PageProps>().props;
  const user = auth.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-cream/90 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 border-border bg-card lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
            Answering Solutions for Funeral Service
          </p>
          <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
            <h1 className="truncate font-serif text-2xl text-navy sm:text-3xl">
              {title}
            </h1>
            {description ? (
              <p className="hidden text-sm text-muted-foreground md:block">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search calls, clients…"
              className="h-10 w-52 rounded-full border border-border bg-card pr-4 pl-9 text-sm text-navy outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30 lg:w-64"
            />
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="relative border-border bg-card"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gold" />
        </Button>

        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pr-3 pl-1 transition hover:border-gold/50"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gold-soft text-xs font-semibold text-navy">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-semibold text-navy">
              {user?.name ?? "Admin"}
            </p>
            <Badge
              variant="secondary"
              className="mt-0.5 h-4 rounded-full bg-gold-soft px-1.5 text-[10px] font-medium text-navy"
            >
              Admin
            </Badge>
          </div>
        </Link>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="border-border bg-card"
          aria-label="Log out"
          onClick={() => router.post(route("logout"))}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
