import { useState, type ReactNode } from "react";
import { usePage } from "@inertiajs/react";
import {
  DashboardSidebar,
  animalsSectionNav,
  contactSectionNav,
  homeSectionNav,
  layoutSectionNav,
  offeringsSectionNav,
  reflectionsSectionNav,
  sophiaSectionNav,
} from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PageMeta } from "@/lib/use-meta";

const pageMeta: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Layout",
    description: "Manage shared site header and footer.",
  },
  "/dashboard/animals": { title: "Animals", description: "Manage animal council members." },
  "/dashboard/offerings": { title: "Offerings list", description: "Manage dynamic offerings." },
  "/dashboard/reflections": { title: "Reflections list", description: "Manage reflection posts." },
  "/dashboard/consultations": { title: "Consultations", description: "Review consultation requests." },
  "/profile": {
    title: "Profile",
    description: "Manage your account details and password.",
  },
};

const navGroups = [
  { items: layoutSectionNav, scope: "site layout" },
  { items: homeSectionNav, scope: "homepage" },
  { items: offeringsSectionNav, scope: "offerings page" },
  { items: animalsSectionNav, scope: "animals page" },
  { items: reflectionsSectionNav, scope: "reflections page" },
  { items: sophiaSectionNav, scope: "sophia scrolls page" },
  { items: contactSectionNav, scope: "contact page" },
] as const;

for (const group of navGroups) {
  for (const item of group.items) {
    pageMeta[item.href] = {
      title: item.label,
      description: `Edit the ${group.scope} ${item.label.toLowerCase()} section.`,
    };
  }
}

function resolveMeta(url: string) {
  const path = url.split("?")[0];
  return (
    pageMeta[path] ?? {
      title: "Dashboard",
      description: "Soul Sanctuary content dashboard.",
    }
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { url } = usePage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const meta = resolveMeta(url);

  return (
    <>
      <PageMeta
        title={`${meta.title} — Sanctuary CMS`}
        description={meta.description}
      />

      <div className="min-h-screen bg-[#faf1e2] text-foreground">
        <div className="flex min-h-screen">
          <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
            <DashboardSidebar />
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <DashboardHeader
              title={meta.title}
              description={meta.description}
              onMenuClick={() => setMobileOpen(true)}
            />

            <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              <div className="mx-auto w-full max-w-5xl">{children}</div>
            </main>
          </div>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="w-[min(100%,20rem)] border-0 bg-[#1a0f06] p-0 text-[#f5ede0] [&>button]:text-[#f5ede0] [&>button]:hover:bg-white/10"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Dashboard navigation</SheetTitle>
              <SheetDescription>
                Navigate Soul Sanctuary website content sections.
              </SheetDescription>
            </SheetHeader>
            <DashboardSidebar onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
