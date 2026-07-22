import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { ImageUploader } from "@/components/ImageUploader";
import { slugify, type Reflection } from "@/lib/cms";

const inputCls = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
const empty: Partial<Reflection> = { slug: "", tag: "", title: "", excerpt: "", body: "", cover_image: null, published: false };

function Modal({ title, onClose, onSave, children }: { title: string; onClose: () => void; onSave: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="text-base font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="text-xl leading-none text-muted-foreground">×</button>
        </div>
        <div className="space-y-4 p-5">{children}</div>
        <div className="flex justify-end gap-3 border-t border-border p-5">
          <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>
          <button type="button" onClick={onSave} className="rounded-md bg-foreground px-4 py-2 text-sm text-background">Save</button>
        </div>
      </div>
    </div>
  );
}

export default function ReflectionsIndex({ items }: { items: Reflection[] }) {
  const { flash } = usePage().props as { flash?: { success?: string } };
  const [editing, setEditing] = useState<Partial<Reflection> | null>(null);

  function save() {
    if (!editing?.title) return;
    const payload = {
      slug: editing.slug || slugify(editing.title),
      tag: editing.tag ?? null,
      title: editing.title,
      excerpt: editing.excerpt ?? null,
      body: editing.body ?? null,
      cover_image: editing.cover_image ?? null,
      published: !!editing.published,
    };
    if (editing.id) {
      router.put(`/dashboard/reflections/${editing.id}`, payload, { onSuccess: () => setEditing(null) });
    } else {
      router.post("/dashboard/reflections", payload, { onSuccess: () => setEditing(null) });
    }
  }

  function remove(id: number) {
    if (!confirm("Delete?")) return;
    router.delete(`/dashboard/reflections/${id}`);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Entities</p>
          <h1 className="mt-1 font-serif text-3xl">Reflections</h1>
          {flash?.success && <p className="mt-1 text-sm text-emerald-700">{flash.success}</p>}
        </div>
        <button type="button" className="rounded-md bg-foreground px-4 py-2 text-sm text-background" onClick={() => setEditing({ ...empty })}>
          + New Reflection
        </button>
      </div>

      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {items.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <div className="truncate font-medium">{r.title}</div>
              <div className="truncate text-xs text-muted-foreground">{r.slug}{r.tag ? ` · ${r.tag}` : ""}</div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className={`rounded px-2 py-1 text-xs ${r.published ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                {r.published ? "Published" : "Draft"}
              </span>
              <button type="button" className="text-sm hover:underline" onClick={() => setEditing(r)}>Edit</button>
              <button type="button" className="text-sm text-red-600 hover:underline" onClick={() => remove(r.id)}>Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No reflections yet.</div>}
      </div>

      {editing && (
        <Modal title={editing.id ? "Edit Reflection" : "New Reflection"} onClose={() => setEditing(null)} onSave={save}>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title *</label>
            <input
              className={inputCls}
              value={editing.title ?? ""}
              onChange={(e) => {
                const title = e.target.value;
                setEditing({
                  ...editing,
                  title,
                  slug: editing.id ? editing.slug : slugify(title),
                });
              }}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slug</label>
            <input className={inputCls} value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tag</label>
            <input className={inputCls} value={editing.tag ?? ""} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Excerpt</label>
            <textarea className={inputCls} rows={3} value={editing.excerpt ?? ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Body</label>
            <textarea className={inputCls} rows={6} value={editing.body ?? ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cover image</label>
            <ImageUploader value={editing.cover_image ?? null} onChange={(url) => setEditing({ ...editing, cover_image: url })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
            Published
          </label>
        </Modal>
      )}
    </div>
  );
}
