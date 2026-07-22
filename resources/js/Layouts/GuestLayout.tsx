import { Link } from "@inertiajs/react";
import { BookOpen } from "lucide-react";
import { PropsWithChildren, ReactNode } from "react";

export default function GuestLayout({
  children,
  title,
  subtitle,
}: PropsWithChildren<{ title?: ReactNode; subtitle?: ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#faf1e2] text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        <aside className="relative hidden overflow-hidden bg-[#1a0f06] px-10 py-12 text-[#f5ede0] lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212_175_106_/_0.28),transparent_55%)]" />
          <div className="relative">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full border border-[#d4af6a]/40">
                <BookOpen className="h-5 w-5 text-[#d4af6a]" />
              </div>
              <span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d4af6a]">
                  Sanctuary of the
                </span>
                <span className="font-serif text-xl">Veil Keepers</span>
              </span>
            </Link>
          </div>

          <div className="relative max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d4af6a]">
              Content management
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight xl:text-5xl">
              Edit the sanctuary with care.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Sign in to manage pages, animals, offerings, reflections, and consultation requests.
            </p>
          </div>

          <p className="relative text-xs text-white/50">
            © {new Date().getFullYear()} Soul Sanctuary
          </p>
        </aside>

        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {(title || subtitle) && (
              <div className="mb-8">
                {title && <h2 className="font-serif text-3xl text-[#2a1a0e]">{title}</h2>}
                {subtitle && <p className="mt-2 text-sm text-[#7c5c3a]">{subtitle}</p>}
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
