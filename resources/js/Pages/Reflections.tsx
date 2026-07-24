import { SanctuaryLayout } from "@/components/SanctuaryLayout";
import type { Reflection } from "@/lib/cms";

export default function Reflections({
  content,
  items,
  sections = {},
}: {
  content: Record<string, string>;
  images: Record<string, string>;
  items: Reflection[];
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

          <h2 style={{ marginTop: 60 }}>{t("posts_heading")}</h2>
          {items.length === 0 ? (
            <p className="sk-note">New reflections are being written. Return soon.</p>
          ) : (
            <div className="sk-grid">
              {items.map((r) => (
                <article key={r.id} className="sk-card">
                  {r.cover_image && (
                    <img src={r.cover_image} alt="" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 4, marginBottom: 16 }} />
                  )}
                  {r.tag && <span className="sk-tag">{r.tag}</span>}
                  <h3>{r.title}</h3>
                  {r.excerpt && <p>{r.excerpt}</p>}
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
