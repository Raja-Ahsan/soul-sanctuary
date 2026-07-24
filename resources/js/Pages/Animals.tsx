import { SanctuaryLayout } from "@/components/SanctuaryLayout";
import type { Animal } from "@/lib/cms";

export default function Animals({
  content,
  items,
  sections = {},
}: {
  content: Record<string, string>;
  images: Record<string, string>;
  items: Animal[];
  sections?: Record<string, boolean>;
}) {
  const t = (key: string) => content[key] ?? "";
  const show = sections.content !== false;

  return (
    <SanctuaryLayout
      eyebrow={show ? t("eyebrow") : ""}
      title={<>{show ? t("title") : ""}</>}
      intro={show ? t("intro") : undefined}
      showHero={show}
    >
      {show ? (
        <>
          <p>{t("body_p1")}</p>
          <p>{t("body_p2")}</p>

          <h2 style={{ marginTop: 60 }}>{t("council_heading")}</h2>
          {items.length === 0 ? (
            <p className="sk-note">The animals are resting. Come back soon.</p>
          ) : (
            <div className="sk-grid">
              {items.map((a) => (
                <article key={a.id} className="sk-card" style={{ textAlign: "center" }}>
                  {a.image_url ? (
                    <img src={a.image_url} alt={a.name} style={{ width: 120, height: 120, objectFit: "cover", borderRadius: "50%", margin: "0 auto 16px" }} />
                  ) : (
                    <div style={{ width: 120, height: 120, borderRadius: "50%", background: "#f0ebe3", margin: "0 auto 16px", display: "grid", placeItems: "center", fontSize: 40 }}>🐾</div>
                  )}
                  <h3>{a.name}</h3>
                  {a.species && <span className="sk-tag">{a.species}</span>}
                  {a.story && <p style={{ marginTop: 12 }}>{a.story}</p>}
                </article>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="sk-note">This page section is currently unavailable.</p>
      )}
    </SanctuaryLayout>
  );
}
