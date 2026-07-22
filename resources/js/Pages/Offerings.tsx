import { Link } from "@inertiajs/react";
import { SanctuaryLayout } from "@/components/SanctuaryLayout";
import type { Offering } from "@/lib/cms";

const IMG_BASE = "https://images.squarespace-cdn.com/content/v1/681a4f1045fd5a114eb9095d";
const FALLBACK_IMAGES: Record<string, string> = {
  "1": `${IMG_BASE}/18aa185c-fd98-4a1b-8018-9b4d62e56304/1+%285%29.jpg?format=1000w`,
  "2": `${IMG_BASE}/dda8ca80-dd02-44cf-b788-c89fe1e74200/1+%283%29.jpg?format=1000w`,
  "3": `${IMG_BASE}/f0529286-9047-43ca-9c83-b06528c587ba/image-asset+copy.jpg?format=1000w`,
  "4": `${IMG_BASE}/105ffb86-1d55-4d3d-93f4-aaaff06e0980/1+%289%29.jpg?format=1000w`,
  "5": `${IMG_BASE}/39d6f70a-6c2b-4805-ad91-b1446eef0a56/1+%284%29.jpg?format=1000w`,
  "6": `${IMG_BASE}/6e200412-ae39-4db3-9209-834bcd607adb/1+%2815%29.jpg?format=1000w`,
};

export default function Offerings({
  content,
  images,
  items,
}: {
  content: Record<string, string>;
  images: Record<string, string>;
  items: Offering[];
}) {
  const t = (key: string) => content[key] ?? "";
  const img = (key: string, fallback = "") => images[key] ?? fallback;

  return (
    <SanctuaryLayout eyebrow={t("eyebrow")} title={<>{t("title")}</>} intro={t("intro")}>
      <div className="sk-grid">
        {["1", "2", "3", "4", "5", "6"].map((n) => (
          <article key={n} className="sk-card">
            <img
              src={img(`off${n}_image`, FALLBACK_IMAGES[n])}
              alt={t(`off${n}_title`)}
              loading="lazy"
              style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 4, marginBottom: 16 }}
            />
            <span className="sk-tag">{t(`off${n}_tag`)}</span>
            <h3>{t(`off${n}_title`)}</h3>
            <p style={{ color: "#7c2d1f", fontStyle: "italic", marginTop: 4 }}>{t(`off${n}_subtitle`)}</p>
            <p style={{ marginTop: 12 }}>{t(`off${n}_body`)}</p>
            <Link href="/consultation" className="sk-btn ghost" style={{ marginTop: 18 }}>Inquire</Link>
          </article>
        ))}
      </div>

      {items.length > 0 && (
        <>
          <h2 style={{ marginTop: 80, textAlign: "center" }}>Currently Open</h2>
          <div className="sk-grid">
            {items.map((o) => (
              <article key={o.id} className="sk-card">
                {o.image_url && <img src={o.image_url} alt="" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 4, marginBottom: 16 }} />}
                {o.tag && <span className="sk-tag">{o.tag}</span>}
                <h3>{o.title}</h3>
                {o.description && <p>{o.description}</p>}
                {o.price && <p style={{ marginTop: 12, color: "#7c2d1f", fontWeight: 500 }}>{o.price}</p>}
                <Link href="/consultation" className="sk-btn ghost" style={{ marginTop: 16 }}>Inquire</Link>
              </article>
            ))}
          </div>
        </>
      )}
    </SanctuaryLayout>
  );
}
