export type FieldType = "text" | "textarea" | "image";
export type Field = { key: string; label: string; type: FieldType; default?: string };
export type PageDef = { slug: string; label: string; groups: { title: string; fields: Field[] }[] };

export const PAGES: PageDef[] = [
  {
    slug: "home",
    label: "Home",
    groups: [
      {
        title: "Navigation & Brand",
        fields: [
          { key: "brand_text", label: "Brand text (top-left)", type: "text", default: "SOUL SANCTUARY" },
        ],
      },
      {
        title: "Hero",
        fields: [
          { key: "hero_eyebrow", label: "Eyebrow", type: "text", default: "SANCTUARY OF THE VEIL KEEPERS" },
          { key: "hero_title", label: "Main title (use \\n for line break)", type: "textarea", default: "Sanctuary <em>of</em>\nVeil Keepers" },
          { key: "hero_sub", label: "Subtitle", type: "textarea", default: "A space between worlds,\na temple beyond time." },
          { key: "hero_cta_primary", label: "Primary button label", type: "text", default: "Request a Consultation" },
          { key: "hero_cta_secondary", label: "Secondary button label", type: "text", default: "Enter the Sanctuary" },
        ],
      },
      {
        title: "Heart of the Sanctuary",
        fields: [
          { key: "heart_title", label: "Section title", type: "textarea", default: "THE HEART OF THE\nSANCTUARY" },
          { key: "heart_p1", label: "Paragraph 1", type: "textarea", default: "Welcome to Sanctuary of the Veil Keepers.\nA place between what is seen and what is remembered." },
          { key: "heart_p2", label: "Paragraph 2", type: "textarea", default: "Here, the air listens.\nThe earth breathes.\nAnd the soul begins to speak again." },
          { key: "heart_p3", label: "Paragraph 3", type: "textarea", default: "This is a sanctuary for the ones who feel too much.\nFor the animals who carry stories in silence.\nFor the light-bringers who forgot their own glow." },
          { key: "heart_p4", label: "Paragraph 4", type: "textarea", default: "We do not rescue.\nWe remember." },
          { key: "heart_p5", label: "Paragraph 5", type: "textarea", default: "We do not heal.\nWe hold." },
          { key: "heart_p6", label: "Paragraph 6", type: "textarea", default: "Come as you are.\nThe veil is thin here.\nAnd on the other side of forgetting—is you." },
          { key: "heart_image", label: "Heart image", type: "image" },
        ],
      },
      {
        title: "Quote",
        fields: [
          { key: "quote_text", label: "Quote text", type: "textarea", default: "Listening is the foundation of my coaching approach. Let me help you discover how to overcome your fears and live the life you deserve." },
        ],
      },
      {
        title: "Method",
        fields: [
          { key: "method_title", label: "Section title", type: "text", default: "MY COACHING METHOD" },
          { key: "method_1_title", label: "Item 1 title", type: "text", default: "FOCUS" },
          { key: "method_1_body", label: "Item 1 body", type: "textarea", default: "It all starts by learning how to focus on what you want." },
          { key: "method_2_title", label: "Item 2 title", type: "text", default: "REFLECT" },
          { key: "method_2_body", label: "Item 2 body", type: "textarea", default: "Next, you'll reflect on what may be blocking you, and learn how to overcome these obstacles." },
          { key: "method_3_title", label: "Item 3 title", type: "text", default: "REFINE" },
          { key: "method_3_body", label: "Item 3 body", type: "textarea", default: "The last step? We learn how to continually refine what we've learned. Think of this as your new beginning." },
        ],
      },
      {
        title: "The Mark of the Veil Keepers",
        fields: [
          { key: "mark_title", label: "Title", type: "textarea", default: "THE MARK OF THE\nVEIL KEEPERS" },
          { key: "mark_body", label: "Body", type: "textarea", default: "This is the mark of those who walk between worlds. You are welcome here." },
          { key: "mark_btn_label", label: "Button label", type: "text", default: "DOWNLOAD SIGIL" },
          { key: "mark_image", label: "Mark image", type: "image" },
        ],
      },
      {
        title: "Living as New Earth",
        fields: [
          { key: "earth_title", label: "Title", type: "textarea", default: "LIVING AS NEW\nEARTH" },
          { key: "earth_btn_label", label: "Button label", type: "text", default: "READ MORE" },
          { key: "earth_image", label: "Earth image", type: "image" },
        ],
      },
      {
        title: "Newsletter & Footer",
        fields: [
          { key: "newsletter_title", label: "Newsletter title", type: "text", default: "NEWSLETTER" },
          { key: "newsletter_sub", label: "Newsletter subtitle", type: "text", default: "Sign up for coaching tips, events, and more." },
          { key: "footer_copy", label: "Footer copyright", type: "text", default: "© 2026 Sanctuary of the Veil Keepers. All rights reserved." },
        ],
      },
    ],
  },
  {
    slug: "offerings",
    label: "Offerings",
    groups: [
      {
        title: "Header",
        fields: [
          { key: "eyebrow", label: "Eyebrow", type: "text", default: "Sacred Offerings" },
          { key: "title", label: "Title", type: "text", default: "Offerings" },
          { key: "intro", label: "Intro", type: "textarea", default: "The Sanctuary does not offer programs. It offers presence — soul reflection, animal kinship, threshold retreats, and sacred passage. What lives here is not a service, but a returning. Choose what calls to you." },
        ],
      },
      ...([
        ["1", "Presence", "Sanctuary for Souls", "A space for inner return", "Sometimes the quiet is what heals us. This offering welcomes those seeking presence, rest, or gentle soul guidance. Whether through a private visit to the sanctuary, a one-on-one reflection session, or simply time spent beneath the trees, this is a place to feel your heart again. Especially held for empaths, light-bearers, and those in transition."],
        ["2", "Kinship", "Animal Kinship & Healing", "A home of mutual remembering", "Our animals are not just guests—they are teachers, mirrors, and carriers of silent wisdom. Some will be available for heart-aligned adoption. Others are here simply to be seen, honored, and loved. This is a space for bonding, energetic healing, or silent companionship."],
        ["3", "Weekly", "Sacred Reflections", "Weekly soul-seeds", "A journal of light, longing, and becoming—posted each week from the heart of the sanctuary. Written to stir your remembrance and soften your days. Available freely online or as a monthly email."],
        ["4", "Retreats", "Threshold Retreats", "For those crossing into the next chapter", "Seasonal day retreats, solstice gatherings, and intimate soul circles held on sacred land. A gentle, immersive invitation to mark life's sacred thresholds."],
        ["5", "Teachings", "Remembering the Veil", "Wisdom for Veil Keepers", "For light-bearers, empaths, and animal intuitives. Soft trainings and sacred teachings to reconnect with your intuitive remembrance and role as a Veil Keeper."],
        ["6", "Passage", "The Whispering Field", "Legacy & transition work", "A space for beings in passage—animal or human. Peaceful transitions, grief holding, or simply shared presence as the veil thins. A place of sacred goodbye."],
      ] as const).map(([n, tag, title, subtitle, body]) => ({
        title: `Offering ${n}: ${title}`,
        fields: [
          { key: `off${n}_tag`, label: "Tag", type: "text" as FieldType, default: tag },
          { key: `off${n}_title`, label: "Title", type: "text" as FieldType, default: title },
          { key: `off${n}_subtitle`, label: "Subtitle", type: "text" as FieldType, default: subtitle },
          { key: `off${n}_body`, label: "Body", type: "textarea" as FieldType, default: body },
          { key: `off${n}_image`, label: "Image", type: "image" as FieldType },
        ],
      })),
    ],
  },
  {
    slug: "the-animals",
    label: "The Animals",
    groups: [
      {
        title: "Header & Copy",
        fields: [
          { key: "eyebrow", label: "Eyebrow", type: "text", default: "Our Council of Beings" },
          { key: "title", label: "Title", type: "text", default: "The Animals" },
          { key: "intro", label: "Intro", type: "textarea", default: "Animals have long been our teachers, companions, and mirrors of the natural world." },
          { key: "body_p1", label: "Paragraph 1", type: "textarea", default: "They embody qualities such as loyalty, courage, innocence, intuition, and presence. By observing and respecting them, we gain a deeper understanding of our connection to nature and our responsibility as caretakers of life." },
          { key: "body_p2", label: "Paragraph 2", type: "textarea", default: "This space explores the wisdom animals offer, the lessons they inspire, and the sacred relationship between humans and all living beings. Through compassion, stewardship, and reverence, we can learn to live more harmoniously with the creatures who share our world and enrich our lives in countless ways." },
          { key: "council_heading", label: "Council section heading", type: "text", default: "Meet the Council" },
        ],
      },
    ],
  },
  {
    slug: "reflections",
    label: "Reflections",
    groups: [
      {
        title: "Header & Copy",
        fields: [
          { key: "eyebrow", label: "Eyebrow", type: "text", default: "Writings from the Sanctuary" },
          { key: "title", label: "Title", type: "text", default: "Reflections" },
          { key: "intro", label: "Intro", type: "textarea", default: "A space for inner thought, personal awareness, and deeper understanding of life's experiences." },
          { key: "body_p1", label: "Paragraph 1", type: "textarea", default: "Reflections invites us to pause and observe our emotions, choices, and the patterns that shape our journey. Through reflection, we begin to see ourselves more clearly — not just who we are on the surface, but what we feel, believe, and value beneath it. It is a practice of honesty and presence, where growth begins through awareness." },
          { key: "body_p2", label: "Paragraph 2", type: "textarea", default: "This section encourages stillness in a busy world, offering a moment to reconnect with the self, question assumptions, and find meaning in everyday experiences." },
          { key: "posts_heading", label: "Posts section heading", type: "text", default: "Soul-Seeds" },
        ],
      },
    ],
  },
  {
    slug: "sophia-scrolls",
    label: "The Sophia Scrolls",
    groups: [
      {
        title: "Header",
        fields: [
          { key: "eyebrow", label: "Eyebrow", type: "text", default: "Sacred Wisdom" },
          { key: "title", label: "Title", type: "text", default: "The Sophia Scrolls" },
          { key: "intro", label: "Intro", type: "textarea", default: "Sacred wisdom for those walking the path of remembrance. Each scroll a living teaching, revealed for these times." },
        ],
      },
    ],
  },
  {
    slug: "contact",
    label: "Contact",
    groups: [
      {
        title: "Header",
        fields: [
          { key: "eyebrow", label: "Eyebrow", type: "text", default: "Get in Touch" },
          { key: "title", label: "Title", type: "text", default: "Contact the Sanctuary" },
          { key: "intro", label: "Intro", type: "textarea", default: "We welcome your messages, questions, and connections. Whether you're interested in visiting, supporting our work, or simply sharing your thoughts, we'd love to hear from you." },
        ],
      },
      {
        title: "Contact Info",
        fields: [
          { key: "visit_title", label: "Visit heading", type: "text", default: "Visit" },
          { key: "visit_body", label: "Visit body", type: "textarea", default: "Our sanctuary is still in development. Please contact us for visitation information — we will hold a place for you when the doors are ready to open." },
          { key: "write_title", label: "Write heading", type: "text", default: "Write" },
          { key: "email", label: "Contact email", type: "text", default: "contact@soulsanctuary.com" },
          { key: "support_title", label: "Support heading", type: "text", default: "Support Our Work" },
          { key: "support_body", label: "Support body", type: "textarea", default: "The sanctuary is sustained by the generosity of those who feel called. Reach out to learn how to support the animals, the land, and the mission." },
        ],
      },
    ],
  },
];

export function getPage(slug: string): PageDef | undefined {
  return PAGES.find((p) => p.slug === slug);
}

export function defaultsForPage(slug: string): Record<string, string> {
  const p = getPage(slug);
  const out: Record<string, string> = {};
  p?.groups.forEach((g) => g.fields.forEach((f) => { if (f.default !== undefined) out[f.key] = f.default; }));
  return out;
}
