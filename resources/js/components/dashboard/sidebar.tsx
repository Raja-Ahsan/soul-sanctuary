import { Link, usePage } from "@inertiajs/react";
import {
  BookOpen,
  ChevronDown,
  ExternalLink,
  Feather,
  Home,
  Inbox,
  Mail,
  PanelsTopLeft,
  PawPrint,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const layoutSectionNav = [
  { key: "header", label: "Header", href: "/dashboard/layout/header" },
  { key: "footer", label: "Footer", href: "/dashboard/layout/footer" },
] as const;

export const homeSectionNav = [
  { key: "hero", label: "Hero", href: "/dashboard/pages/home/hero" },
  { key: "heart", label: "Heart of the Sanctuary", href: "/dashboard/pages/home/heart" },
  { key: "quote", label: "Quote", href: "/dashboard/pages/home/quote" },
  { key: "method", label: "Method", href: "/dashboard/pages/home/method" },
  { key: "mark", label: "Mark of the Veil Keepers", href: "/dashboard/pages/home/mark" },
  { key: "earth", label: "Living as New Earth", href: "/dashboard/pages/home/earth" },
  { key: "newsletter", label: "Newsletter", href: "/dashboard/pages/home/newsletter" },
] as const;

export const offeringsSectionNav = [
  { key: "header", label: "Header", href: "/dashboard/pages/offerings/header" },
  { key: "offering-1", label: "Offering 1", href: "/dashboard/pages/offerings/offering-1" },
  { key: "offering-2", label: "Offering 2", href: "/dashboard/pages/offerings/offering-2" },
  { key: "offering-3", label: "Offering 3", href: "/dashboard/pages/offerings/offering-3" },
  { key: "offering-4", label: "Offering 4", href: "/dashboard/pages/offerings/offering-4" },
  { key: "offering-5", label: "Offering 5", href: "/dashboard/pages/offerings/offering-5" },
  { key: "offering-6", label: "Offering 6", href: "/dashboard/pages/offerings/offering-6" },
] as const;

export const animalsSectionNav = [
  { key: "content", label: "Header & Copy", href: "/dashboard/pages/the-animals/content" },
] as const;

export const reflectionsSectionNav = [
  { key: "content", label: "Header & Copy", href: "/dashboard/pages/reflections/content" },
] as const;

export const sophiaSectionNav = [
  { key: "header", label: "Header", href: "/dashboard/pages/sophia-scrolls/header" },
] as const;

export const contactSectionNav = [
  { key: "header", label: "Header", href: "/dashboard/pages/contact/header" },
  { key: "info", label: "Contact Info", href: "/dashboard/pages/contact/info" },
] as const;

const entityNav = [
  { key: "animals", label: "Animals", href: "/dashboard/animals", icon: PawPrint },
  { key: "offerings", label: "Offerings list", href: "/dashboard/offerings", icon: Sparkles },
  { key: "reflections", label: "Reflections list", href: "/dashboard/reflections", icon: Feather },
  { key: "consultations", label: "Consultations", href: "/dashboard/consultations", icon: Inbox },
] as const;

function isSectionActive(url: string, href: string) {
  return url === href || url.startsWith(`${href}?`);
}

export function DashboardSidebar({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const page = usePage();
  const currentUrl = page.url;
  const status = (page.props as { cmsSections?: Record<string, Record<string, boolean>> | null }).cmsSections;

  function withStatus<T extends { key: string }>(
    pageSlug: string,
    items: ReadonlyArray<T>,
  ): Array<T & { enabled: boolean }> {
    return items.map((item) => ({
      ...item,
      enabled: status?.[pageSlug]?.[item.key] !== false,
    }));
  }

  const groups = [
    {
      key: "layout",
      label: "Layout",
      icon: PanelsTopLeft,
      active: currentUrl.startsWith("/dashboard/layout"),
      items: withStatus("layout", layoutSectionNav),
    },
    {
      key: "home",
      label: "Home",
      icon: Home,
      active: currentUrl.startsWith("/dashboard/pages/home"),
      items: withStatus("home", homeSectionNav),
    },
    {
      key: "offerings",
      label: "Offerings",
      icon: Sparkles,
      active: currentUrl.startsWith("/dashboard/pages/offerings"),
      items: withStatus("offerings", offeringsSectionNav),
    },
    {
      key: "animals",
      label: "The Animals",
      icon: PawPrint,
      active: currentUrl.startsWith("/dashboard/pages/the-animals"),
      items: withStatus("the-animals", animalsSectionNav),
    },
    {
      key: "reflections",
      label: "Reflections",
      icon: Feather,
      active: currentUrl.startsWith("/dashboard/pages/reflections"),
      items: withStatus("reflections", reflectionsSectionNav),
    },
    {
      key: "sophia",
      label: "Sophia Scrolls",
      icon: ScrollText,
      active: currentUrl.startsWith("/dashboard/pages/sophia-scrolls"),
      items: withStatus("sophia-scrolls", sophiaSectionNav),
    },
    {
      key: "contact",
      label: "Contact",
      icon: Mail,
      active: currentUrl.startsWith("/dashboard/pages/contact"),
      items: withStatus("contact", contactSectionNav),
    },
  ];

  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((group) => [group.key, group.active])),
  );

  useEffect(() => {
    setOpenMap((current) => {
      const next = { ...current };
      for (const group of groups) {
        if (group.active) next[group.key] = true;
      }
      return next;
    });
  }, [currentUrl]);

  return (
    <aside
      className={cn(
        "flex h-full w-72 flex-col bg-[#1a0f06] text-[#f5ede0]",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <div className="grid h-10 w-10 place-items-center rounded-full border border-[#d4af6a]/40">
          <BookOpen className="h-5 w-5 text-[#d4af6a]" />
        </div>
        <div className="min-w-0 leading-tight">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d4af6a]">
            Soul Sanctuary
          </p>
          <p className="truncate font-serif text-lg">CMS Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
          Content
        </p>

        {groups.map((group, index) => (
          <NavDropdown
            key={group.key}
            label={group.label}
            icon={group.icon}
            active={group.active}
            open={Boolean(openMap[group.key])}
            onToggle={() =>
              setOpenMap((current) => ({
                ...current,
                [group.key]: !current[group.key],
              }))
            }
            items={group.items}
            url={currentUrl}
            onNavigate={onNavigate}
            className={index === 0 ? undefined : "mt-1"}
          />
        ))}

        <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
          Entities
        </p>
        {entityNav.map((item) => {
          const Icon = item.icon;
          const active = currentUrl === item.href || currentUrl.startsWith(`${item.href}/`) || currentUrl.startsWith(`${item.href}?`);
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-[#d4af6a] font-semibold text-[#1a0f06]"
                  : "text-white/70 hover:bg-white/8 hover:text-white",
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-[#1a0f06]" : "text-[#d4af6a]")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#d4af6a]">
            Website
          </p>
          <p className="mt-1 font-serif text-xl">Sanctuary CMS</p>
          <p className="mt-1 text-xs text-white/60">
            Edit layout and every page section from one dashboard.
          </p>
          <Link
            href="/"
            onClick={onNavigate}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4af6a] hover:brightness-110"
          >
            View website
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

function NavDropdown({
  label,
  icon: Icon,
  active,
  open,
  onToggle,
  items,
  url,
  onNavigate,
  className,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  active: boolean;
  open: boolean;
  onToggle: () => void;
  items: ReadonlyArray<{ key: string; label: string; href: string; enabled?: boolean }>;
  url: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
          active
            ? "bg-white/10 text-[#f5ede0]"
            : "text-white/75 hover:bg-white/8 hover:text-white",
        )}
        aria-expanded={open}
      >
        <Icon
          className={cn("h-4 w-4", active ? "text-[#d4af6a]" : "text-[#d4af6a]/80")}
          strokeWidth={2.25}
        />
        <span className="flex-1">{label}</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open ? "rotate-180" : "")}
        />
      </button>

      {open ? (
        <div className="ml-3 space-y-1 border-l border-white/10 pl-3">
          {items.map((item) => {
            const sectionActive = isSectionActive(url, item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                  sectionActive
                    ? "bg-[#d4af6a] font-semibold text-[#1a0f06] shadow-sm"
                    : "text-white/70 hover:bg-white/8 hover:text-white",
                )}
              >
                {item.label}
                {item.enabled === false ? (
                  <span className={cn("ml-1 text-[10px] uppercase tracking-wide", sectionActive ? "opacity-80" : "text-amber-400")}>
                    Off
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
