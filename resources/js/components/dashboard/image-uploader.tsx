import { useRef, type ChangeEvent, type DragEvent } from "react";
import { ImagePlus, Replace, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageUploaderProps = {
  label: string;
  preview: string | null;
  error?: string;
  helperText?: string;
  onSelect: (file: File) => void;
  onRemove: () => void;
  className?: string;
  previewClassName?: string;
};

export function ImageUploader({
  label,
  preview,
  error,
  helperText,
  onSelect,
  onRemove,
  className,
  previewClassName,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => inputRef.current?.click();

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      return;
    }
    onSelect(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Allow selecting the same file again after remove/replace.
    e.target.value = "";
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-navy">{label}</p>
        <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-navy">
          Image uploader
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        className="sr-only"
        onChange={onChange}
      />

      {preview ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="relative">
            <img
              src={preview}
              alt=""
              className={cn(
                "h-48 w-full object-cover",
                previewClassName,
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                className="rounded-full bg-cream text-navy hover:bg-gold-soft"
                onClick={openPicker}
              >
                <Replace className="h-4 w-4" />
                Change image
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-primary-foreground/40 bg-navy/40 text-primary-foreground hover:bg-navy/60 hover:text-primary-foreground"
                onClick={() => {
                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
                  onRemove();
                }}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
          <p className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
            Click <span className="font-semibold text-navy">Change image</span> to
            replace, or <span className="font-semibold text-navy">Remove</span> to
            clear and fall back to the default image.
          </p>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPicker();
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gold/40 bg-gold-soft/30 px-6 py-10 text-center transition hover:border-gold hover:bg-gold-soft/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40",
            error && "border-destructive/50 bg-destructive/5",
          )}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card shadow-sm ring-1 ring-border">
            <ImagePlus className="h-7 w-7 text-gold" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-sm font-semibold text-navy">
              Upload section image
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Drag & drop or click to browse · PNG, JPG, WEBP · max 4MB
            </p>
          </div>
          <span className="rounded-full bg-navy px-4 py-2 text-xs font-semibold text-primary-foreground">
            Choose image
          </span>
        </div>
      )}

      {helperText && !error ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
