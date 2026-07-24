import { FormEvent, useEffect, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { ImageUploader } from "@/components/ImageUploader";

type Field = { key: string; label: string; type: "text" | "textarea" | "image"; default?: string };
type Row = { key: string; value: string; image_url: string | null; type: string; label: string };
type SectionNav = { key: string; label: string; description: string; href: string; enabled: boolean };

export default function EditSection({
  pageSlug,
  pageLabel,
  sectionKey,
  sectionTitle,
  sectionDescription,
  fields,
  rows: initialRows,
  sections,
  enabled: initialEnabled,
  updateUrl,
  groupLabel,
}: {
  pageSlug: string;
  pageLabel: string;
  sectionKey: string;
  sectionTitle: string;
  sectionDescription: string;
  fields: Field[];
  rows: Record<string, Row>;
  sections: SectionNav[];
  enabled: boolean;
  updateUrl: string;
  groupLabel: string;
}) {
  const { flash } = usePage().props as { flash?: { success?: string } };
  const [rows, setRows] = useState(initialRows);
  const [enabled, setEnabled] = useState(initialEnabled);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRows(initialRows);
    setEnabled(initialEnabled);
  }, [initialRows, initialEnabled, pageSlug, sectionKey]);

  function update(key: string, patch: Partial<Row>) {
    setRows((prev) => ({ ...prev, [key]: { ...prev[key], key, ...patch } }));
  }

  function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    router.put(
      updateUrl,
      {
        enabled,
        items: fields.map((f) => ({
          key: f.key,
          value: rows[f.key]?.value ?? "",
          image_url: rows[f.key]?.image_url ?? null,
        })),
      },
      {
        preserveScroll: true,
        onFinish: () => setSaving(false),
      },
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {groupLabel}
          </p>
          <h1 className="mt-1 font-serif text-3xl text-foreground">{sectionTitle}</h1>
          {sectionDescription ? (
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{sectionDescription}</p>
          ) : null}
        </div>
        {flash?.success && <p className="text-sm text-emerald-700">{flash.success}</p>}
      </div>

      {sections.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {sections.map((s) => {
            const active = s.key === sectionKey;
            return (
              <Link
                key={s.key}
                href={s.href}
                className={
                  active
                    ? "rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background"
                    : "rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                }
              >
                {s.label}
                {!s.enabled ? (
                  <span className={active ? "ml-1 opacity-80" : "ml-1 text-amber-700"}>
                    · Off
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      )}

      <form onSubmit={save} className="rounded-xl border border-border bg-card">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold">{pageLabel} · {sectionTitle}</h2>
          <label className="inline-flex cursor-pointer items-center gap-3 text-sm">
            <span className={enabled ? "text-emerald-700" : "text-amber-700"}>
              {enabled ? "Section visible" : "Section disabled"}
            </span>
            <span className="relative inline-flex h-6 w-11 items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
              />
              <span className="absolute inset-0 rounded-full bg-muted transition peer-checked:bg-emerald-600" />
              <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
            </span>
          </label>
        </header>

        {!enabled && (
          <div className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-900">
            This section is disabled and will not appear on the public website. Content is kept and can be re-enabled anytime.
          </div>
        )}

        <div className={`grid grid-cols-1 gap-5 p-5 md:grid-cols-2 ${enabled ? "" : "opacity-60"}`}>
          {fields.map((f) => {
            const row = rows[f.key];
            const cls = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

            if (f.type === "image") {
              return (
                <div key={f.key} className="md:col-span-2">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {f.label}
                  </label>
                  <ImageUploader
                    value={row?.image_url ?? null}
                    onChange={(url) => update(f.key, { image_url: url })}
                  />
                </div>
              );
            }

            return (
              <div key={f.key} className={f.type === "textarea" ? "md:col-span-2" : ""}>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {f.label}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    rows={4}
                    className={cls}
                    value={row?.value ?? ""}
                    onChange={(e) => update(f.key, { value: e.target.value })}
                  />
                ) : (
                  <input
                    className={cls}
                    value={row?.value ?? ""}
                    onChange={(e) => update(f.key, { value: e.target.value })}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 border-t border-border px-5 py-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-foreground px-5 py-2 text-sm text-background hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save section"}
          </button>
        </div>
      </form>
    </div>
  );
}
