import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { SanctuaryLayout } from "@/components/SanctuaryLayout";

const images = [
  "https://images.squarespace-cdn.com/content/v1/681a4f1045fd5a114eb9095d/105ffb86-1d55-4d3d-93f4-aaaff06e0980/1+%289%29.jpg",
  "https://images.squarespace-cdn.com/content/v1/681a4f1045fd5a114eb9095d/39d6f70a-6c2b-4805-ad91-b1446eef0a56/1+%284%29.jpg",
  "https://images.squarespace-cdn.com/content/v1/681a4f1045fd5a114eb9095d/af0ab189-db6f-4454-a45d-d39d65381d6f/1+%286%29.jpg",
  "https://images.squarespace-cdn.com/content/v1/5ec321c2af33de48734cc929/1589847767761-J2M1HI20BXRQ9XCR0HUD/Large+JPG-Aro+Ha_0387.jpg",
  "https://images.squarespace-cdn.com/content/v1/5ec321c2af33de48734cc929/1607694583486-2PQT0LQ193RL7MCB6DX4/20140228_Trade+151_0046.jpg",
  "https://images.squarespace-cdn.com/content/v1/5ec321c2af33de48734cc929/1607694644871-IC85FNH781UNZSZEGHDR/Aro+Ha_0428.jpg",
  "https://images.squarespace-cdn.com/content/v1/5ec321c2af33de48734cc929/1618497259178-6XJGK9GR6YAVBQL5L519/20140301_Trade-151_012-2.jpg",
];

const scrolls = [
  { title: "The Sanctuary as Portal", body: "On the sanctuary as a living threshold — a doorway between what has been forgotten and what is beginning to remember itself through you." },
  { title: "The Witnesses — Before and After the Shift", body: "A message for those who stood at the edge of the old world and were called to walk into the new. You are the witnesses. You are the bridge." },
  { title: "The Waters of 2029", body: "The waters are rising, and with them, an ancient current of remembrance. A scroll for the ones who feel the tide within their own bodies." },
  { title: "For the Ones Who Were Slaughtered", body: "A tender remembrance for the animals, the innocents, the silenced. Their voices are not gone — they have folded into the wind." },
  { title: "The Quiet Radiance of True Ascension", body: "Ascension is not loud. It does not perform. It is the soft steady light of a soul that has finally come home to itself." },
  { title: "The New Earth Covenant", body: "A vow woven between the human, the animal, the earth, and the unseen. The covenant is being rewritten in every heart willing to listen." },
  { title: "The Circle Remembered", body: "The circle was never broken. It only waited. A scroll on the return of the ones who were always meant to gather again." },
].map((s, i) => ({ ...s, image: images[i % images.length] }));

export default function SophiaScrolls({
  content,
}: {
  content: Record<string, string>;
  images: Record<string, string>;
}) {
  const t = (key: string) => content[key] ?? "";
  const [index, setIndex] = useState(0);
  const total = scrolls.length;

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 6000);
    return () => clearInterval(id);
  }, [total]);

  const go = (delta: number) => setIndex((i) => (i + delta + total) % total);
  const current = scrolls[index];

  return (
    <SanctuaryLayout eyebrow={t("eyebrow")} title={<>{t("title")}</>} intro={t("intro")}>
      <p style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 40px", fontStyle: "italic" }}>
        They arrive not to teach, but to awaken. Not to convince, but to call.<br />
        Each scroll is a veil lifted. Each word, a code remembered.<br />
        Enter gently. She is here.
      </p>

      <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", marginBottom: 60 }}>
        <img
          src={current.image}
          alt=""
          style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,6,2,0.85) 0%, transparent 50%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "40px 48px" }}>
          <h2 style={{ color: "#f5ede0", margin: 0 }}>{current.title}</h2>
          <p style={{ color: "#c8b89a", marginTop: 12, maxWidth: 560 }}>{current.body}</p>
        </div>
        <button onClick={() => go(-1)} aria-label="Previous" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", color: "#fff", fontSize: 18 }}>‹</button>
        <button onClick={() => go(1)} aria-label="Next" style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", color: "#fff", fontSize: 18 }}>›</button>
        <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
          {scrolls.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} style={{ width: 8, height: 8, borderRadius: "50%", border: "none", background: i === index ? "#d4af6a" : "rgba(255,255,255,0.4)", cursor: "pointer", padding: 0 }} />
          ))}
        </div>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: 40 }}>{t("scrolls_heading") || "All Scrolls"}</h2>
      <div className="sk-grid">
        {scrolls.map((s, i) => (
          <article key={i} className="sk-card">
            <img src={s.image} alt="" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 4, marginBottom: 16 }} />
            <h3>{s.title}</h3>
            <p style={{ marginTop: 10 }}>{s.body}</p>
          </article>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 60 }}>
        <p style={{ fontStyle: "italic", color: "#7c2d1f" }}>To receive new scrolls as they arrive, come into the circle.</p>
        <Link href="/consultation" className="sk-btn" style={{ marginTop: 20 }}>Enter the Circle</Link>
      </div>
    </SanctuaryLayout>
  );
}
