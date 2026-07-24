import { useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react";
import rawHtml from "@/assets/home.html?raw";

function textToHtml(v: string): string {
  return v.replace(/\r\n?/g, "\n").split("\n").join("<br>");
}

function extractBody(raw: string): { head: string; body: string } {
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const styleMatch = raw.match(/<style[\s\S]*?<\/style>/i);
  return { head: styleMatch?.[0] ?? "", body: bodyMatch?.[1] ?? raw };
}

function applyCms(root: HTMLElement, text: Record<string, string>, images: Record<string, string>) {
  root.querySelectorAll<HTMLElement>("[data-cms]").forEach((el) => {
    const key = el.dataset.cms!;
    const v = text[key];
    if (v != null) el.innerHTML = textToHtml(v);
  });
  root.querySelectorAll<HTMLImageElement>("[data-cms-img]").forEach((el) => {
    const key = el.dataset.cmsImg!;
    const v = images[key];
    if (v) el.src = v;
  });
}

function applySectionVisibility(
  root: HTMLElement,
  sections: Record<string, boolean>,
  site?: { header_enabled?: boolean; footer_enabled?: boolean },
) {
  root.querySelectorAll<HTMLElement>("[data-cms-section]").forEach((el) => {
    const key = el.dataset.cmsSection!;
    const enabled = sections[key] !== false;
    el.style.display = enabled ? "" : "none";
  });

  if (site?.header_enabled === false) {
    root.querySelectorAll<HTMLElement>(".navbar, #navOverlay").forEach((el) => {
      el.style.display = "none";
    });
  }

  if (site?.footer_enabled === false) {
    root.querySelectorAll<HTMLElement>("footer.footer").forEach((el) => {
      el.style.display = "none";
    });
  }
}

export default function Home({
  content,
  images,
  sections = {},
}: {
  content: Record<string, string>;
  images: Record<string, string>;
  sections?: Record<string, boolean>;
}) {
  const { site } = usePage().props as {
    site?: {
      brand_text?: string;
      footer_copy?: string;
      header_enabled?: boolean;
      footer_enabled?: boolean;
    };
  };
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    root.classList.remove("loaded");
    const { head, body } = extractBody(rawHtml);
    root.innerHTML = head + body;

    const scripts = Array.from(root.querySelectorAll("script"));
    scripts.forEach((old) => {
      const s = document.createElement("script");
      if (old.src) {
        s.src = old.src;
      } else {
        s.textContent = `(function(){\n${old.textContent ?? ""}\n})();`;
      }
      old.parentNode?.replaceChild(s, old);
    });

    const merged = {
      ...content,
      brand_text: site?.brand_text ?? content.brand_text ?? "SOUL SANCTUARY",
      footer_copy:
        site?.footer_copy ??
        content.footer_copy ??
        `© ${new Date().getFullYear()} Sanctuary of the Veil Keepers. All rights reserved.`,
    };

    applyCms(root, merged, images);
    applySectionVisibility(root, sections, site);

    return () => {
      if (root) root.innerHTML = "";
    };
  }, [content, images, sections, site]);

  return <div ref={ref} className="sanctuary-home-root" />;
}
