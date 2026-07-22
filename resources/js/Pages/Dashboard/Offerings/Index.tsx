import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { ImageUploader } from "@/components/ImageUploader";
import type { Offering } from "@/lib/cms";

const inputCls = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
const empty: Partial<Offering> = { title: "", tag: "", description: "", price: "", image_url: null, sort_order: 0, visible: true };

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

export default function OfferingsIndex({ items }: { items: Offering[] }) {
  const { flash } = usePage().props as { flash?: { success?: string } };
  const [editing, setEditing] = useState<Partial<Offering> | null>(null);

  function save() {
    if (!editing?.title) return;
    const payload = {
      title: editing.title,
      tag: editing.tag ?? null,
      description: editing.description ?? null,
      price: editing.price ?? null,
      image_url: editing.image_url ?? null,
      sort_order: editing.sort_order ?? 0,
      visible: !!editing.visible,
    };
    if (editing.id) {
      router.put(`/dashboard/offerings/${editing.id}`, payload, { onSuccess: () => setEditing(null) });
    } else {
      router.post("/dashboard/offerings", payload, { onSuccess: () => setEditing(null) });
    }
  }

  function remove(id: number) {
    if (!confirm("Delete?")) return;
    router.delete(`/dashboard/offerings/${id}`);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Entities</p>
          <h1 className="mt-1 font-serif text-3xl">Offerings</h1>
          {flash?.success && <p className="mt-1 text-sm text-emerald-700">{flash.success}</p>}
        </div>
        <button type="button" className="rounded-md bg-foreground px-4 py-2 text-sm text-background" onClick={() => setEditing({ ...empty })}>
          + New Offering
        </button>
      </div>

      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {items.map((o) => (
          <div key={o.id} className="flex items-center justify-between gap-4 p-4">
            <div className="flex min-w-0 items-center gap-4">
              {o.image_url && <img src={o.image_url} className="h-16 w-16 rounded object-cover" alt="" />}
              <div className="min-w-0">
                <div className="truncate font-medium">{o.title}</div>
                <div className="truncate text-xs text-muted-foreground">{o.tag}{o.price ? ` · ${o.price}` : ""}</div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className={`rounded px-2 py-1 text-xs ${o.visible ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                {o.visible ? "Visible" : "Hidden"}
              </span>
              <button type="button" className="text-sm hover:underline" onClick={() => setEditing(o)}>Edit</button>
              <button type="button" className="text-sm text-red-600 hover:underline" onClick={() => remove(o.id)}>Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No offerings yet.</div>}
      </div>

      {editing && (
        <Modal title={editing.id ? "Edit Offering" : "New Offering"} onClose={() => setEditing(null)} onSave={save}>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title *</label>
            <input className={inputCls} value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tag</label>
            <input className={inputCls} value={editing.tag ?? ""} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
            <textarea className={inputCls} rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</label>
            <input className={inputCls} value={editing.price ?? ""} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Image</label>
            <ImageUploader value={editing.image_url ?? null} onChange={(url) => setEditing({ ...editing, image_url: url })} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sort order</label>
              <input type="number" className={inputCls} value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
            </div>
            <label className="mt-6 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!editing.visible} onChange={(e) => setEditing({ ...editing, visible: e.target.checked })} />
              Visible
            </label>
          </div>
        </Modal>
      )}
    </div>
  );
}
