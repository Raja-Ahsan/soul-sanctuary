// ── Types ─────────────────────────────────────────────────────────────────────

export type Animal = {
  id: number;
  name: string;
  species: string | null;
  story: string | null;
  image_url: string | null;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

export type Offering = {
  id: number;
  title: string;
  tag: string | null;
  description: string | null;
  price: string | null;
  image_url: string | null;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

export type Reflection = {
  id: number;
  slug: string;
  tag: string | null;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_image: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Consultation = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

function xsrfToken(): string {
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

// ── Upload helper ─────────────────────────────────────────────────────────────

export async function uploadCmsImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/dashboard/upload", {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": xsrfToken(),
      "X-Requested-With": "XMLHttpRequest",
    },
    body: form,
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error((e as { message?: string; error?: string }).message ?? (e as { error?: string }).error ?? "Upload failed");
  }
  const { url } = (await res.json()) as { url: string };
  return url;
}

// ── Slug helper ───────────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}
