import { FormEvent } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { SanctuaryLayout } from "@/components/SanctuaryLayout";

export default function Contact({
  content,
}: {
  content: Record<string, string>;
  images: Record<string, string>;
}) {
  const t = (key: string) => content[key] ?? "";
  const { flash } = usePage().props as { flash?: { success?: string } };
  const form = useForm({
    name: "",
    email: "",
    message: "",
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    form.post("/consultations", {
      preserveScroll: true,
      onSuccess: () => form.reset(),
    });
  }

  const email = t("email");
  const sent = Boolean(flash?.success);

  return (
    <SanctuaryLayout eyebrow={t("eyebrow")} title={<>{t("title")}</>} intro={t("intro")}>
      <div className="sk-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
        <div>
          <h3>{t("visit_title")}</h3>
          <p>{t("visit_body")}</p>
          <h3 style={{ marginTop: 30 }}>{t("write_title")}</h3>
          <p>Email: <a href={`mailto:${email}`} style={{ color: "#7c2d1f" }}>{email}</a></p>
          <h3 style={{ marginTop: 30 }}>{t("support_title")}</h3>
          <p>{t("support_body")}</p>
        </div>

        {sent ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <p style={{ fontSize: 22, fontStyle: "italic", color: "#7c2d1f" }}>Your message has reached us.</p>
            <p className="sk-note">We read every note with care.</p>
          </div>
        ) : (
          <form className="sk-form" onSubmit={onSubmit} style={{ marginTop: 0 }}>
            <div>
              <label htmlFor="c-name">Name</label>
              <input id="c-name" required value={form.data.name} onChange={(e) => form.setData("name", e.target.value)} />
            </div>
            <div>
              <label htmlFor="c-email">Email</label>
              <input id="c-email" type="email" required value={form.data.email} onChange={(e) => form.setData("email", e.target.value)} />
            </div>
            <div>
              <label htmlFor="c-msg">Message</label>
              <textarea id="c-msg" required value={form.data.message} onChange={(e) => form.setData("message", e.target.value)} />
            </div>
            {form.errors.message && <p style={{ color: "#b91c1c", fontSize: 14 }}>{form.errors.message}</p>}
            <button className="sk-btn" type="submit" disabled={form.processing}>{form.processing ? "Sending…" : "Send Message"}</button>
          </form>
        )}
      </div>
    </SanctuaryLayout>
  );
}
