import { FormEvent, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { SanctuaryLayout } from "@/components/SanctuaryLayout";

export default function Consultation() {
  const { flash } = usePage().props as { flash?: { success?: string } };
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const message = [form.interest ? `Interest: ${form.interest}` : "", form.message]
      .filter(Boolean)
      .join("\n\n");

    router.post(
      "/consultations",
      {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        message,
      },
      {
        preserveScroll: true,
        onFinish: () => setBusy(false),
        onSuccess: () => setForm({ name: "", email: "", phone: "", interest: "", message: "" }),
        onError: () => setErr("Please check the form and try again."),
      },
    );
  }

  const submitted = Boolean(flash?.success);

  return (
    <SanctuaryLayout
      eyebrow="The First Conversation"
      title={<>Request a Consultation</>}
      intro="A brief, private letter to the sanctuary. We read every one, and we respond within a few days."
    >
      {submitted ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ fontSize: 22, fontStyle: "italic", color: "#7c2d1f" }}>Your letter has reached the sanctuary.</p>
          <p className="sk-note">We hold what you have written with care. You will hear from us soon.</p>
        </div>
      ) : (
        <form className="sk-form" onSubmit={onSubmit}>
          <div>
            <label htmlFor="name">Your Name</label>
            <input id="name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label htmlFor="phone">Phone (optional)</label>
            <input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label htmlFor="interest">What draws you here?</label>
            <select id="interest" value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })}>
              <option value="">Select an offering</option>
              <option>The Listening — private session</option>
              <option>Threshold Ceremony</option>
              <option>Three Days of the Veil — retreat</option>
              <option>The Second Wave Council</option>
              <option>I'm not sure yet</option>
            </select>
          </div>
          <div>
            <label htmlFor="message">Your Letter</label>
            <textarea id="message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Say only what feels true. There is no right way to write this." />
          </div>
          {err && <p style={{ color: "#b91c1c", fontSize: 14 }}>{err}</p>}
          <button className="sk-btn" type="submit" disabled={busy}>{busy ? "Sending…" : "Send Letter"}</button>
          <p className="sk-note">All correspondence is held in strict confidence.</p>
        </form>
      )}
    </SanctuaryLayout>
  );
}
