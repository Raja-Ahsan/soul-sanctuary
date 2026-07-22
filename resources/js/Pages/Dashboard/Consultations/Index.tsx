import { router, usePage } from "@inertiajs/react";
import type { Consultation } from "@/lib/cms";

const statuses = ["new", "read", "replied", "archived"] as const;

export default function ConsultationsIndex({ items }: { items: Consultation[] }) {
  const { flash } = usePage().props as { flash?: { success?: string } };

  function setStatus(id: number, status: string) {
    router.put(`/dashboard/consultations/${id}`, { status }, { preserveScroll: true });
  }

  function remove(id: number) {
    if (!confirm("Delete?")) return;
    router.delete(`/dashboard/consultations/${id}`);
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Inbox</p>
        <h1 className="mt-1 font-serif text-3xl">Consultations</h1>
        {flash?.success && <p className="mt-1 text-sm text-emerald-700">{flash.success}</p>}
      </div>

      <div className="space-y-4">
        {items.map((c) => (
          <article key={c.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-medium">{c.name}</h2>
                <p className="text-sm text-muted-foreground">
                  <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>
                  {c.phone ? ` · ${c.phone}` : ""}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                  value={c.status}
                  onChange={(e) => setStatus(c.id, e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button type="button" className="text-sm text-red-600 hover:underline" onClick={() => remove(c.id)}>Delete</button>
              </div>
            </div>
            {c.message && <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{c.message}</p>}
          </article>
        ))}
        {items.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No consultation requests yet.
          </div>
        )}
      </div>
    </div>
  );
}
