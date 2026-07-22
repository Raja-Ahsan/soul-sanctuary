export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type NavLinkItem = {
    label: string;
    href: string;
};

export type SiteHeaderContent = {
    brand_eyebrow: string;
    brand_title: string;
    phone_label: string;
    phone_href: string;
    cta_label: string;
    cta_url: string;
    nav: NavLinkItem[];
};

export type SiteFooterContent = {
    brand_eyebrow: string;
    brand_title: string;
    body: string;
    explore_heading: string;
    explore_links: NavLinkItem[];
    contact_heading: string;
    phone_label: string;
    phone_href: string;
    email_label: string;
    email_href: string;
    address: string;
    copyright: string;
};

export type SiteTestimonialItem = {
    quote: string;
    author: string;
    role: string;
};

export type SiteTestimonialsContent = {
    eyebrow: string;
    title: string;
    items: SiteTestimonialItem[];
};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
    };
    flash?: {
        success?: string | null;
    };
    site?: {
        header: SiteHeaderContent;
        testimonials: SiteTestimonialsContent;
        footer: SiteFooterContent;
    };
};
