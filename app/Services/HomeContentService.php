<?php

namespace App\Services;

use App\Models\HomeSection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class HomeContentService
{
    /**
     * @return array<string, array{label: string, description: string, sort: int}>
     */
    public function registry(?string $group = null): array
    {
        $configs = $this->configs();

        if ($group !== null) {
            return $configs[$group] ?? [];
        }

        $all = [];

        foreach ($configs as $sections) {
            $all += $sections;
        }

        return $all;
    }

    /**
     * @return array<string, array<string, array{label: string, description: string, sort: int}>>
     */
    private function configs(): array
    {
        return [
            'home' => config('home-sections', []),
            'layout' => config('site-layout', []),
            'about' => config('about-sections', []),
            'services' => config('services-sections', []),
            'why' => config('why-sections', []),
            'contact' => config('contact-sections', []),
        ];
    }

    public function groupFor(string $key): ?string
    {
        foreach ($this->configs() as $group => $sections) {
            if (array_key_exists($key, $sections)) {
                return $group;
            }
        }

        return null;
    }

    /**
     * @return array{edit: string, update: string, label: string}
     */
    public function routesFor(string $group): array
    {
        return match ($group) {
            'layout' => [
                'edit' => 'dashboard.layout.edit',
                'update' => 'dashboard.layout.update',
                'label' => 'Site layout',
            ],
            'about' => [
                'edit' => 'dashboard.about.edit',
                'update' => 'dashboard.about.update',
                'label' => 'About page',
            ],
            'services' => [
                'edit' => 'dashboard.services.edit',
                'update' => 'dashboard.services.update',
                'label' => 'Services page',
            ],
            'why' => [
                'edit' => 'dashboard.why.edit',
                'update' => 'dashboard.why.update',
                'label' => 'Why Soul Sanctuary page',
            ],
            'contact' => [
                'edit' => 'dashboard.contact.edit',
                'update' => 'dashboard.contact.update',
                'label' => 'Contact page',
            ],
            default => [
                'edit' => 'dashboard.home.edit',
                'update' => 'dashboard.home.update',
                'label' => 'Home page',
            ],
        };
    }

    public function ensureDefaults(): void
    {
        foreach ($this->registry() as $key => $meta) {
            HomeSection::query()->firstOrCreate(
                ['key' => $key],
                [
                    'label' => $meta['label'],
                    'sort_order' => $meta['sort'],
                    'content' => $this->defaults()[$key] ?? [],
                ],
            );
        }
    }

    /**
     * @param  list<string>|null  $keys
     */
    public function syncDefaults(?array $keys = null): void
    {
        $this->ensureDefaults();

        $defaults = $this->defaults();
        $registry = $this->registry();
        $keys ??= array_keys($registry);

        foreach ($keys as $key) {
            if (! isset($defaults[$key])) {
                continue;
            }

            HomeSection::query()->where('key', $key)->update([
                'label' => $registry[$key]['label'] ?? $key,
                'sort_order' => $registry[$key]['sort'] ?? 0,
                'content' => $defaults[$key],
            ]);
        }
    }

    /**
     * @return array<string, array{key: string, label: string, description: string, content: array<string, mixed>}>
     */
    public function allForAdmin(): array
    {
        $this->ensureDefaults();

        $sections = HomeSection::query()
            ->orderBy('sort_order')
            ->get()
            ->keyBy('key');

        $result = [];

        foreach ($this->registry() as $key => $meta) {
            $section = $sections->get($key);

            $result[$key] = [
                'key' => $key,
                'label' => $meta['label'],
                'description' => $meta['description'],
                'content' => $this->mergeWithDefaults(
                    $key,
                    $section?->content ?? ($this->defaults()[$key] ?? []),
                ),
            ];
        }

        return $result;
    }

    /**
     * @return array{key: string, label: string, description: string, content: array<string, mixed>}
     */
    public function getForAdmin(string $key): array
    {
        $this->ensureDefaults();

        $meta = $this->registry()[$key] ?? null;

        abort_unless($meta, 404);

        $section = HomeSection::query()->where('key', $key)->firstOrFail();

        return [
            'key' => $key,
            'label' => $meta['label'],
            'description' => $meta['description'],
            'content' => $this->mergeWithDefaults($key, $section->content),
        ];
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function allForPublic(string $group = 'home'): array
    {
        $this->ensureDefaults();

        $keys = array_keys($this->registry($group));

        return HomeSection::query()
            ->whereIn('key', $keys)
            ->orderBy('sort_order')
            ->get()
            ->mapWithKeys(fn (HomeSection $section) => [
                $section->key => $this->mergeWithDefaults($section->key, $section->content),
            ])
            ->all();
    }

    /**
     * @return array{header: array<string, mixed>, testimonials: array<string, mixed>, footer: array<string, mixed>}
     */
    public function layoutForPublic(): array
    {
        $this->ensureDefaults();

        return [
            'header' => $this->contentOrDefault('header'),
            'testimonials' => $this->contentOrDefault('testimonials'),
            'footer' => $this->contentOrDefault('footer'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function contentOrDefault(string $key): array
    {
        $section = HomeSection::query()->where('key', $key)->first();

        return $this->mergeWithDefaults($key, $section?->content);
    }

    /**
     * Fill in any newly added default keys without overwriting existing CMS values.
     *
     * @param  array<string, mixed>|null  $content
     * @return array<string, mixed>
     */
    private function mergeWithDefaults(string $key, ?array $content): array
    {
        $defaults = $this->defaults()[$key] ?? [];

        return array_replace($defaults, $content ?? []);
    }

    /**
     * @param  array<string, mixed>  $content
     * @return array<string, mixed>
     */
    public function update(
        string $key,
        array $content,
        ?UploadedFile $image = null,
        bool $removeImage = false,
    ): array {
        $this->ensureDefaults();

        abort_unless(isset($this->registry()[$key]), 404);

        return DB::transaction(function () use ($key, $content, $image, $removeImage) {
            $section = HomeSection::query()->where('key', $key)->lockForUpdate()->firstOrFail();

            // Replace top-level keys so list fields (checklist/items) shrink correctly.
            $payload = array_merge($section->content, $content);

            if ($image) {
                $path = $image->store("home/{$key}", 'public');

                $this->deleteStoredImage($section->content['image'] ?? null);

                $payload['image'] = Storage::url($path);
            } elseif ($removeImage) {
                $this->deleteStoredImage($section->content['image'] ?? null);
                $payload['image'] = null;
            }

            $section->update(['content' => $payload]);

            return $section->fresh()->content;
        });
    }

    private function deleteStoredImage(mixed $path): void
    {
        if (! is_string($path) || $path === '') {
            return;
        }

        if (! str_starts_with($path, '/storage/')) {
            return;
        }

        Storage::disk('public')->delete(str_replace('/storage/', '', $path));
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function defaults(): array
    {
        return [
            'banner' => [
                'eyebrow' => 'Answering the phones like you — because we were you.',
                'title' => 'Compassionate 24/7 answering, built only for funeral homes.',
                'body' => 'Soul Sanctuary is a family-owned answering service run by former funeral home owners and licensed professionals. Every call is handled with the empathy, dignity, and industry knowledge your families deserve.',
                'primary_cta_label' => 'Book a Consultation',
                'primary_cta_url' => '/contact',
                'phone_label' => '(866) 628-5140',
                'phone_href' => 'tel:+8666285140',
                'checklist' => [
                    'Former funeral home owners',
                    'Instant message delivery',
                    'Fully customizable',
                ],
                'image' => null,
                'image_alt' => 'Serene white lilies beside a softly glowing candle',
                'badge_title' => 'Trusted since 2005',
                'badge_subtitle' => 'Funeral homes nationwide',
            ],
            'stats' => [
                'items' => [
                    ['value' => '24/7', 'label' => 'Always answered'],
                    ['value' => '20+', 'label' => 'Years funeral experience'],
                    ['value' => '100%', 'label' => 'Funeral-only focus'],
                    ['value' => 'Family', 'label' => 'Owned & operated'],
                ],
            ],
            'intro' => [
                'eyebrow' => '',
                'title' => 'Just ask our clients.',
                'body' => '',
                'paragraphs' => [],
                'lead' => '',
                'quote' => 'Answering Solutions for Funeral Service is the best answering service I\'ve ever had. I never have a worry when transferring lines. I know I\'ll get all my messages and anyone calling will be treated well. When I have to leave town, I go with total confidence that my business is in good hands.',
                'quote_author' => 'Jay "Mitch" Locke',
                'quote_role' => 'Yampa Valley Funeral Home, Steamboat Springs, CO',
            ],
            'services' => [
                'eyebrow' => 'What we do',
                'title' => 'Everything a funeral home needs',
                'subtitle' => 'Purpose-built services that keep you informed and your families cared for.',
                'link_label' => 'Explore all services',
                'link_url' => '/services',
                'items' => [
                    ['icon' => 'Phone', 'title' => 'First Call Handling', 'body' => 'Every first call is answered with the empathy, tact, and professionalism a grieving family deserves — exactly as your own staff would.'],
                    ['icon' => 'Send', 'title' => 'Instant Message Delivery', 'body' => 'Receive every message the way you prefer — email, text, or fax — the moment a call comes in, so you are always informed.'],
                    ['icon' => 'ShieldCheck', 'title' => 'Verification Services', 'body' => 'Careful confirmation of critical details so nothing is missed and every family\'s needs are documented accurately.'],
                    ['icon' => 'Map', 'title' => 'Local Information', 'body' => 'Callers receive accurate, helpful local information about your funeral home, hours, and services at any hour.'],
                    ['icon' => 'Globe', 'title' => 'Secure Web Portal Access', 'body' => 'Review your call activity and messages anytime through a secure online portal built for funeral professionals.'],
                    ['icon' => 'Server', 'title' => 'Redundancy Technology', 'body' => 'Backup systems and redundant infrastructure ensure your calls are always answered — no matter what.'],
                    ['icon' => 'Sparkles', 'title' => 'Full Customization', 'body' => 'Scripts, greetings, and call handling tailored precisely to your funeral home\'s voice and procedures.'],
                    ['icon' => 'GraduationCap', 'title' => 'Industry-Specific Training', 'body' => 'Every call specialist is trained specifically in funeral service — because we grew up in this profession.'],
                ],
            ],
            'why' => [
                'eyebrow' => 'Why choose Soul Sanctuary',
                'title' => 'The way your calls are handled is how your business is perceived.',
                'body' => 'We know from personal experience that a grieving family remembers how they were treated on the phone. When you use Soul Sanctuary, everyone who calls your business is greeted with professionalism, caring, tact, and empathy — a seamless continuation of the service you already provide.',
                'link_label' => 'Learn what sets us apart',
                'link_url' => '/why-Soul Sanctuary',
                'items' => [
                    ['title' => 'Family-owned & operated', 'body' => 'Run by the Santillanes family, not a call-center corporation.'],
                    ['title' => '20+ years of funeral experience', 'body' => 'Former owners and licensed professionals answer your calls.'],
                    ['title' => 'Available 24 / 7 / 365', 'body' => 'Redundant technology means your phones are always covered.'],
                ],
            ],
            'family' => [
                'eyebrow' => 'Meet the family',
                'title' => 'Jeff & Cissy Santillanes',
                'body' => 'Soul Sanctuary is owned and operated by the Santillanes family. Having spent decades in funeral service as owners and licensed professionals, they built this company on a simple promise: to answer every call the way a funeral home would — with genuine compassion and complete professionalism.',
                'quote' => '“A funeral director helping a funeral director was pivotal in our decision. Answering Solutions really understands the needs of funeral service.”',
                'quote_author' => 'Steve & Nanci Trevino',
                'quote_role' => 'Ponderosa Valley Funeral Services',
                'link_label' => 'Read our story',
                'link_url' => '/about',
                'image' => null,
                'image_alt' => 'Jeff Santillanes, owner of Answering Solutions for Funeral Service',
            ],
            'cta' => [
                'eyebrow' => 'Just ask our clients',
                'title' => 'Ready to provide better service to your families?',
                'body' => "Schedule a no-pressure consultation with Jeff. We'll listen to your needs and show you exactly how Soul Sanctuary becomes a seamless extension of your team.",
                'button_label' => 'Book a Consultation',
                'button_url' => '/contact',
                'phone_label' => '(866) 628-5140',
                'phone_href' => 'tel:+18666285140',
            ],
            'header' => [
                'brand_eyebrow' => 'Answering Solutions for',
                'brand_title' => 'Funeral Service',
                'phone_label' => '(866) 628-5140',
                'phone_href' => 'tel:+8666285140',
                'cta_label' => 'Book a Consultation',
                'cta_url' => '/contact',
                'nav' => [
                    ['label' => 'Home', 'href' => '/'],
                    ['label' => 'About', 'href' => '/about'],
                    ['label' => 'Services', 'href' => '/services'],
                    ['label' => 'Why Soul Sanctuary', 'href' => '/why-Soul Sanctuary'],
                    ['label' => 'Contact', 'href' => '/contact'],
                ],
            ],
            'footer' => [
                'brand_eyebrow' => 'Answering Solutions for',
                'brand_title' => 'Funeral Service',
                'body' => 'A family-owned answering service run by former funeral home owners. Compassionate, professional call coverage — 24 / 7 / 365.',
                'explore_heading' => 'Explore',
                'explore_links' => [
                    ['label' => 'About', 'href' => '/about'],
                    ['label' => 'Services', 'href' => '/services'],
                    ['label' => 'Why Soul Sanctuary', 'href' => '/why-Soul Sanctuary'],
                    ['label' => 'Contact', 'href' => '/contact'],
                ],
                'contact_heading' => 'Contact',
                'phone_label' => '(866) 628-5140',
                'phone_href' => 'tel:+8666285140',
                'email_label' => 'Jeff@Soul Sanctuary.com',
                'email_href' => 'mailto:Jeff@Soul Sanctuary.com',
                'address' => 'Rio Rancho, NM 87124',
                'copyright' => 'Answering Solutions for Funeral Service. All rights reserved.',
            ],
            'testimonials' => [
                'eyebrow' => 'Just ask our clients',
                'title' => 'What funeral homes say about Soul Sanctuary',
                'items' => [
                    [
                        'quote' => 'We wanted a more personalized service … It was easy to select Answering Solutions. A funeral director helping a funeral director was pivotal in our decision. Answering Solutions really understands the needs of funeral service. Thank you for the professionalism and personalized service you provide as a continuation of our personalized service.',
                        'author' => 'Steve and Nanci Trevino',
                        'role' => 'Ponderosa Valley Funeral Services',
                    ],
                    [
                        'quote' => 'I was reluctant to turn our phones over to an answering service, but we have been with your service for almost a year. Your service has been just like we added another employee to our staff. I would recommend your services very highly.',
                        'author' => 'William G. Golden',
                        'role' => 'Chandler Memorial Funeral Home, Chandler, Texas',
                    ],
                    [
                        'quote' => 'Answering Solutions for Funeral Service has handled each call to Anderson-Clayton Bros. with compassion and dignity. Jeff and his staff have always been a trusted resource for assisting us in serving each of our family\'s needs during a difficult time.',
                        'author' => 'Veronica Wilkerson',
                        'role' => 'General Manager, Anderson Clayton Bros. Funeral Homes',
                    ],
                    [
                        'quote' => 'We have used Answering Solutions for the past seven years. They have always been professional and courteous with all of our families. We would recommend Answering Solutions to provide the highest quality of service for your funeral home.',
                        'author' => 'Kathi Morley',
                        'role' => 'Piper-Morley with Oakwood Hill',
                    ],
                    [
                        'quote' => 'Answering Solutions for Funeral Service is the best answering service I\'ve ever had. I never have a worry when transferring lines. I know I\'ll get all my messages and anyone calling will be treated well. When I have to leave town, I go with total confidence that my business is in good hands.',
                        'author' => 'Jay "Mitch" Locke',
                        'role' => 'Yampa Valley Funeral Home, Steamboat Springs, CO',
                    ],
                    [
                        'quote' => 'Brentwood Funeral Home has used the services of Answering Solutions since November 2005 and have found them to be very polite on the telephone to my staff and customers. The information is relayed with accuracy and promptly to our office by fax. When answering our telephones, they answer in a timely manner. Answering Solutions has been a telephone blessing for after hours calls for us.',
                        'author' => 'Raymond A Glosser',
                        'role' => 'Brentwood Funeral Home',
                    ],
                    [
                        'quote' => 'The best thing about Answering Solutions is that you can always count on the job getting done in a timely, professional manner and the customer is always treated with kindness, which is important to our business. As soon as a first call is received, I am emailed the information so I am always informed.',
                        'author' => 'Ron Clark',
                        'role' => 'Butterworth Arthur A. Wright Funeral Chapel',
                    ],
                ],
            ],
            'about_hero' => [
                'meta_title' => 'About Us — Answering Solutions for Funeral Service',
                'meta_description' => 'We grew up in the funeral services business, just like you. Meet Jeff and Cissy Santillanes.',
                'og_description' => 'We grew up in the funeral services business, just like you.',
                'eyebrow' => 'About us',
                'title' => 'We grew up in the funeral services business, just like you.',
                'body' => 'Meet the Santillanes family — former funeral home owners who built Soul Sanctuary exclusively for funeral service.',
            ],
            'about_story' => [
                'image' => null,
                'image_alt' => 'Jeff Santillanes, owner of Soul Sanctuary',
                'image_caption' => 'Jeff Santillanes',
                'paragraphs' => [
                    "Jeff Santillanes is a second generation funeral director. He's a graduate of Cypress College of Mortuary Science. Following his internship, he was licensed as a Thanatopractitioner (funeral director and embalmer) in New Mexico in 1983. He managed family funeral homes for several years until he went on to manage, then purchase two funeral homes in southern New Mexico.",
                    "With 20 years' licensed experience in the funeral industry, Jeff saw the need for an answering service that was customized exclusively for the funeral service industry – not just adapted for it. When Jeff, his wife Cissy and daughter Jennifer made the decision to open Answering Solutions for Funeral Service, their goal was not to be the largest, but rather the best telephone answering service for the funeral service industry.",
                ],
                'quote' => '“We answer the phones like you — because we were you.”',
            ],
            'about_cissy' => [
                'image' => null,
                'image_alt' => 'Cissy Santillanes',
                'image_caption' => 'Cissy Santillanes',
                'paragraphs' => [
                    'Cissy Santillanes began working in funeral services in 1985 and there was no stopping her. She has done everything that funeral home owners do, including owning funeral homes. She was licensed in the State of New Mexico as an Assistant Funeral Director and has made funeral arrangements, directed funerals, dug graves, washed cars, embalmed, dressed, cosmetized and casketed, along with writing and submitting obituaries and death certificates, printing memorial folders and prayer cards, managing payroll, and everything else that funeral services owners do.',
                    'Before coming on full time with Answering Solutions, Cissy was a Financial Specialist for the State of New Mexico. With her knowledge and experience in funeral service, combined with her expertise in business management, she is a considerable asset for customers of Answering Solutions for Funeral Service.',
                ],
            ],
            'about_values' => [
                'eyebrow' => 'Our values',
                'title' => 'What we stand for',
                'items' => [
                    ['icon' => 'Heart', 'title' => 'Compassion first', 'body' => 'We treat every caller with the kindness and dignity a grieving family deserves.'],
                    ['icon' => 'Award', 'title' => 'Licensed experience', 'body' => 'Over 20 years as owners and licensed professionals in funeral service.'],
                    ['icon' => 'Users', 'title' => 'Truly family-owned', 'body' => 'A family business that partners with family businesses — not a faceless call center.'],
                ],
            ],
            'about_cta' => [
                'eyebrow' => 'Meet the family behind the phones',
                'title' => 'Let our family serve yours',
                'body' => 'Partner with a team that understands funeral service from the inside out.',
                'button_label' => 'Book a Consultation',
                'button_url' => '/contact',
                'phone_label' => '(866) 628-5140',
                'phone_href' => 'tel:+18666285140',
            ],
            'services_hero' => [
                'meta_title' => 'Our Services — Answering Solutions for Funeral Service',
                'meta_description' => 'We answer calls just like you, not like an answering service. We only answer calls for the funeral service industry.',
                'og_description' => 'We answer calls just like you, not like an answering service.',
                'eyebrow' => 'Our services',
                'title' => 'We answer calls just like you, not like an answering service.',
                'body' => 'We only answer calls for the funeral service industry.',
            ],
            'services_grid' => [
                'items' => [],
            ],
            'services_included' => [
                'eyebrow' => '',
                'title' => 'We only answer calls for the funeral service industry.',
                'intro_paragraphs' => [
                    'Answering Solutions for Funeral Service is located and headquartered in the southwestern United States. We serve clients throughout the country and only answer phones for your industry, the funeral service industry.',
                ],
                'list_intro' => "When we set up your account, it's customized to provide:",
                'items' => [
                    'Directions to your funeral home',
                    'Funeral service information',
                    'Local cemeteries',
                    'Local places of worship',
                    'Local hotels and motels',
                    'Any additional information you would like provided',
                ],
                'closing_paragraphs' => [
                    'We also verify death/funeral services for the Red Cross and newspapers when they call, and we can verify the name of the driver for air cargo when you are shipping out.',
                    "When answering first calls on your behalf, we'll take all the information you ask us to take, and we'll customize questions based on who's calling, just like you would.",
                    'Our service is specific and complete. Please let us tell you exactly how we can help you.',
                ],
            ],
            'services_cta' => [
                'eyebrow' => '',
                'title' => 'Phone us today.',
                'body' => 'Call (866)628-5140.',
                'button_label' => 'Book a Consultation',
                'button_url' => '/contact',
                'phone_label' => '(866) 628-5140',
                'phone_href' => 'tel:+18666285140',
            ],
            'why_hero' => [
                'meta_title' => 'Why Soul Sanctuary - Answering Solutions for Funeral Services',
                'meta_description' => "In funeral services, you don't get second chance calls. Answering the phones just like you.",
                'og_description' => "In funeral services, you don't get second chance calls.",
                'eyebrow' => 'Why Soul Sanctuary',
                'title' => "In funeral services, you don't get second chance calls.",
                'body' => 'Answering the phones just like you.',
            ],
            'why_reasons' => [
                'items' => [
                    [
                        'icon' => 'Heart',
                        'title' => 'Answering the phones just like you.',
                        'body' => 'Everyone who works at Answering Solutions for Funeral Service either grew up in the funeral service industry or was trained by someone who did. What does that mean for your business? When we answer your calls, we do it as an extension of your office, not like an answering service. We understand that one of your greatest challenges is that people believe funeral establishments are available 24 hours per day, every day. When they phone your business and reach a service, they assume they\'re speaking with someone in your office. We never give people a reason to doubt that.',
                    ],
                    [
                        'icon' => 'Server',
                        'title' => 'Total redundancy technology.',
                        'body' => 'We don\'t just have the latest technology, we also have the latest software and firmware available for the industry. That means you\'ll get your messages instantly, via text, e-mail, fax, voicemail ... whatever works for you. And just to make absolutely sure that nothing goes wrong, we have full redundancy. Both our data and phone service has back-up. What does that mean to you? We\'ve got you covered. Feel that weight lifting off your shoulders? When you become an Answering Solutions customer, we\'ll set you up with Web site access that will allow you to view and listen to messages, 24 hours a day, within moments after they are go into the system.',
                    ],
                    [
                        'icon' => 'Phone',
                        'title' => 'The first phone call is crucial.',
                        'body' => 'We know that from personal experience that the way your calls are handled is crucial to how your business is perceived. Anyone phoning your business will always believe that whoever answers the phone represents your business. Shouldn\'t that caller be treated exactly as you would treat them? We know what you expect from an answering service. You want your service to be consistent. You want your phone calls handled with courtesy, accuracy and patience. You want people to be just as pleased with that critical first contact as they would be speaking with you personally. You want every call handled with professionalism, caring, tact and empathy. All it takes is one, poorly trained operator saying the wrong thing to one family and you\'ll be spending hours mending fences – with hospice staff, clergy, hospitals, nursing homes and families – because of one careless comment.',
                    ],
                    [
                        'icon' => 'ShieldCheck',
                        'title' => 'Your business hangs on how your phones are handled.',
                        'body' => 'The funeral services industry is unique since so much hangs on how first calls are handled. People making those calls are in their most fragile state. We know that. We know that they need to be helped, guided and understood. It may, in fact, be the single most important phone call made when a loved one dies. A missed or poorly handled first call can mean more than lost business. It can mean entire families lost forever. We understand that. And our customers know that we do. Just ask them. It\'s not just missed business when calls go unanswered or are poorly handled. It\'s your reputation. We know that. We answer your phones with that in mind.',
                    ],
                ],
            ],
            'why_quote' => [
                'title' => 'Your business hangs on how your phones are handled.',
                'body' => 'The funeral services industry is unique since so much hangs on how first calls are handled. People making those calls are in their most fragile state. We know that. We know that they need to be helped, guided and understood. It may, in fact, be the single most important phone call made when a loved one dies. A missed or poorly handled first call can mean more than lost business. It can mean entire families lost forever. We understand that. And our customers know that we do. Just ask them.',
                'quote' => 'It\'s not just missed business when calls go unanswered or are poorly handled. It\'s your reputation. We know that. We answer your phones with that in mind.',
                'quote_author' => 'Answering Solutions for Funeral Service',
                'quote_role' => 'Soul Sanctuary',
            ],
            'why_cta' => [
                'eyebrow' => 'Just ask them.',
                'title' => 'Just ask them.',
                'body' => 'A missed or poorly handled first call can mean more than lost business. It can mean entire families lost forever. We understand that. And our customers know that we do. Just ask them.',
                'button_label' => 'Book a Consultation',
                'button_url' => '/contact',
                'phone_label' => '(866) 628-5140',
                'phone_href' => 'tel:+18666285140',
            ],
            'contact_hero' => [
                'meta_title' => 'Contact Us — Answering Solutions for Funeral Service',
                'meta_description' => 'We know you\'re not just trusting calls to us, you\'re trusting your business. Contact Soul Sanctuary for rates, services, and client information.',
                'og_description' => 'We know you\'re not just trusting calls to us, you\'re trusting your business.',
                'eyebrow' => 'Contact us',
                'title' => 'We know you\'re not just trusting calls to us, you\'re trusting your business.',
                'body' => 'Please contact us today for more information about our services, our rates and our clients.',
            ],
            'contact_info' => [
                'intro_title' => 'Contact Us',
                'intro_paragraphs' => [
                    'Our industry expertise makes us the answering service of choice for funeral homes across the nation. We pride ourselves on our knowledge, compassion and service when it comes to answering your phones.',
                    'Our operators are trained as funeral home receptionists, offering a more personalized service than other answering services.',
                    'Please contact us today for more information about our services, our rates and our clients.',
                ],
                'methods' => [
                    ['icon' => 'Phone', 'label' => 'Telephone', 'value' => '(866) 628-5140', 'href' => 'tel:+18666285140'],
                    ['icon' => 'Phone', 'label' => 'Fax', 'value' => '(505) 896-6699', 'href' => 'tel:+15058966699'],
                    ['icon' => 'Mail', 'label' => 'e-mail', 'value' => 'info@Soul Sanctuary.com', 'href' => 'mailto:info@Soul Sanctuary.com'],
                ],
                'form_title' => 'Request a consultation',
                'success_title' => 'Thank you.',
                'success_body' => 'We will reach out to you shortly.',
                'name_label' => 'Your name',
                'name_placeholder' => 'Jane Doe',
                'home_label' => 'Funeral home',
                'home_placeholder' => 'Evergreen Funeral Home',
                'email_label' => 'Email',
                'email_placeholder' => 'you@example.com',
                'phone_label' => 'Phone',
                'phone_placeholder' => '(555) 555-5555',
                'message_label' => 'How can we help?',
                'message_placeholder' => "Tell us a little about your funeral home and what you're looking for.",
                'submit_label' => 'Request My Consultation',
                'prefer_text' => 'Prefer to talk now?',
                'prefer_phone_label' => '(866) 628-5140',
                'prefer_phone_href' => 'tel:+18666285140',
                'prefer_email_label' => 'info@Soul Sanctuary.com',
                'prefer_email_href' => 'mailto:info@Soul Sanctuary.com',
            ],
        ];
    }
}
