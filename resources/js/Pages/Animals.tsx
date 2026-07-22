import { SanctuaryLayout } from "@/components/SanctuaryLayout";
import type { Animal } from "@/lib/cms";

export default function Animals({
  content,
  items,
}: {
  content: Record<string, string>;
  images: Record<string, string>;
  items: Animal[];
}) {
  const t = (key: string) => content[key] ?? "";

  return (
    <SanctuaryLayout eyebrow={t("eyebrow")} title={<>{t("title")}</>} intro={t("intro")}>
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
    </SanctuaryLayout>
  );
}
