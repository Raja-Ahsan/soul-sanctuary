import { useState } from "react";
import { uploadCmsImage } from "@/lib/cms";

export function ImageUploader({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {value ? (
        <img src={value} alt="" className="w-40 h-28 object-cover rounded border border-slate-200" />
      ) : (
        <div className="w-40 h-28 rounded border border-dashed border-slate-300 grid place-items-center text-xs text-slate-400">
          No image
        </div>
      )}
      <div className="flex gap-2 items-center">
        <label className="cursor-pointer text-sm rounded bg-slate-900 text-white px-3 py-1.5 hover:bg-slate-800">
          {busy ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setBusy(true);
              setErr(null);
              try {
                const url = await uploadCmsImage(f);
                onChange(url);
              } catch (ex) {
                setErr(ex instanceof Error ? ex.message : "Upload failed");
              } finally {
                setBusy(false);
                e.target.value = "";
              }
            }}
          />
        </label>
        {value && (
          <button
            type="button"
            className="text-sm text-red-600 hover:underline"
            onClick={() => onChange(null)}
          >
            Remove
          </button>
        )}
      </div>
      {err && <p className="text-xs text-red-600">{err}</p>}
    </div>
  );
}
