<?php

namespace App\Http\Requests\Dashboard;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHomeSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $key = (string) $this->route('section');

        return match ($key) {
            'banner' => [
                'eyebrow' => ['required', 'string', 'max:160'],
                'title' => ['required', 'string', 'max:255'],
                'body' => ['required', 'string', 'max:2000'],
                'primary_cta_label' => ['required', 'string', 'max:80'],
                'primary_cta_url' => ['required', 'string', 'max:255'],
                'phone_label' => ['required', 'string', 'max:40'],
                'phone_href' => ['required', 'string', 'max:80'],
                'checklist' => ['required', 'array', 'min:1', 'max:6'],
                'checklist.*' => ['required', 'string', 'max:120'],
                'image_alt' => ['required', 'string', 'max:255'],
                'badge_title' => ['required', 'string', 'max:120'],
                'badge_subtitle' => ['required', 'string', 'max:120'],
                'image' => ['nullable', 'image', 'max:4096'],
                'remove_image' => ['sometimes', 'boolean'],
            ],
            'stats' => [
                'items' => ['required', 'array', 'size:4'],
                'items.*.value' => ['required', 'string', 'max:40'],
                'items.*.label' => ['required', 'string', 'max:80'],
            ],
            'intro' => [
                'eyebrow' => ['nullable', 'string', 'max:120'],
                'title' => ['required', 'string', 'max:255'],
                'body' => ['nullable', 'string', 'max:2000'],
                'paragraphs' => ['nullable', 'array', 'max:8'],
                'paragraphs.*' => ['nullable', 'string', 'max:2000'],
                'lead' => ['nullable', 'string', 'max:500'],
                'quote' => ['nullable', 'string', 'max:2000'],
                'quote_author' => ['nullable', 'string', 'max:160'],
                'quote_role' => ['nullable', 'string', 'max:255'],
            ],
            'services' => [
                'eyebrow' => ['required', 'string', 'max:120'],
                'title' => ['required', 'string', 'max:255'],
                'subtitle' => ['required', 'string', 'max:500'],
                'link_label' => ['required', 'string', 'max:80'],
                'link_url' => ['required', 'string', 'max:255'],
                'items' => ['required', 'array', 'min:1', 'max:12'],
                'items.*.icon' => ['required', 'string', Rule::in([
                    'Phone', 'Send', 'ShieldCheck', 'Map', 'Globe', 'Server', 'Sparkles', 'GraduationCap',
                ])],
                'items.*.title' => ['required', 'string', 'max:120'],
                'items.*.body' => ['required', 'string', 'max:500'],
            ],
            'why' => [
                'eyebrow' => ['required', 'string', 'max:120'],
                'title' => ['required', 'string', 'max:255'],
                'body' => ['required', 'string', 'max:2000'],
                'link_label' => ['required', 'string', 'max:80'],
                'link_url' => ['required', 'string', 'max:255'],
                'items' => ['required', 'array', 'min:1', 'max:6'],
                'items.*.title' => ['required', 'string', 'max:120'],
                'items.*.body' => ['required', 'string', 'max:400'],
            ],
            'family' => [
                'eyebrow' => ['required', 'string', 'max:120'],
                'title' => ['required', 'string', 'max:255'],
                'body' => ['required', 'string', 'max:2000'],
                'quote' => ['required', 'string', 'max:1000'],
                'quote_author' => ['required', 'string', 'max:120'],
                'quote_role' => ['required', 'string', 'max:160'],
                'link_label' => ['required', 'string', 'max:80'],
                'link_url' => ['required', 'string', 'max:255'],
                'image_alt' => ['required', 'string', 'max:255'],
                'image' => ['nullable', 'image', 'max:4096'],
                'remove_image' => ['sometimes', 'boolean'],
            ],
            'cta' => [
                'eyebrow' => ['required', 'string', 'max:120'],
                'title' => ['required', 'string', 'max:255'],
                'body' => ['required', 'string', 'max:1000'],
                'button_label' => ['required', 'string', 'max:80'],
                'button_url' => ['required', 'string', 'max:255'],
                'phone_label' => ['required', 'string', 'max:40'],
                'phone_href' => ['required', 'string', 'max:80'],
            ],
            'header' => [
                'brand_eyebrow' => ['required', 'string', 'max:120'],
                'brand_title' => ['required', 'string', 'max:120'],
                'phone_label' => ['required', 'string', 'max:40'],
                'phone_href' => ['required', 'string', 'max:80'],
                'cta_label' => ['required', 'string', 'max:80'],
                'cta_url' => ['required', 'string', 'max:255'],
                'nav' => ['required', 'array', 'min:1', 'max:8'],
                'nav.*.label' => ['required', 'string', 'max:60'],
                'nav.*.href' => ['required', 'string', 'max:255'],
            ],
            'footer' => [
                'brand_eyebrow' => ['required', 'string', 'max:120'],
                'brand_title' => ['required', 'string', 'max:120'],
                'body' => ['required', 'string', 'max:1000'],
                'explore_heading' => ['required', 'string', 'max:60'],
                'explore_links' => ['required', 'array', 'min:1', 'max:8'],
                'explore_links.*.label' => ['required', 'string', 'max:60'],
                'explore_links.*.href' => ['required', 'string', 'max:255'],
                'contact_heading' => ['required', 'string', 'max:60'],
                'phone_label' => ['required', 'string', 'max:40'],
                'phone_href' => ['required', 'string', 'max:80'],
                'email_label' => ['required', 'string', 'max:120'],
                'email_href' => ['required', 'string', 'max:160'],
                'address' => ['required', 'string', 'max:160'],
                'copyright' => ['required', 'string', 'max:255'],
            ],
            'testimonials' => [
                'eyebrow' => ['required', 'string', 'max:120'],
                'title' => ['required', 'string', 'max:255'],
                'items' => ['required', 'array', 'min:1', 'max:20'],
                'items.*.quote' => ['required', 'string', 'max:2000'],
                'items.*.author' => ['required', 'string', 'max:160'],
                'items.*.role' => ['required', 'string', 'max:255'],
            ],
            'about_hero' => [
                'meta_title' => ['required', 'string', 'max:160'],
                'meta_description' => ['required', 'string', 'max:300'],
                'og_description' => ['required', 'string', 'max:300'],
                'eyebrow' => ['required', 'string', 'max:120'],
                'title' => ['required', 'string', 'max:255'],
                'body' => ['required', 'string', 'max:1000'],
            ],
            'about_story' => [
                'image_alt' => ['required', 'string', 'max:255'],
                'image_caption' => ['required', 'string', 'max:160'],
                'paragraphs' => ['required', 'array', 'min:1', 'max:8'],
                'paragraphs.*' => ['required', 'string', 'max:4000'],
                'quote' => ['nullable', 'string', 'max:500'],
                'image' => ['nullable', 'image', 'max:4096'],
                'remove_image' => ['sometimes', 'boolean'],
            ],
            'about_cissy' => [
                'image_alt' => ['required', 'string', 'max:255'],
                'image_caption' => ['required', 'string', 'max:160'],
                'paragraphs' => ['required', 'array', 'min:1', 'max:8'],
                'paragraphs.*' => ['required', 'string', 'max:4000'],
                'image' => ['nullable', 'image', 'max:4096'],
                'remove_image' => ['sometimes', 'boolean'],
            ],
            'about_values' => [
                'eyebrow' => ['required', 'string', 'max:120'],
                'title' => ['required', 'string', 'max:255'],
                'items' => ['required', 'array', 'min:1', 'max:6'],
                'items.*.icon' => ['required', 'string', Rule::in(['Heart', 'Award', 'Users', 'ShieldCheck', 'Sparkles'])],
                'items.*.title' => ['required', 'string', 'max:120'],
                'items.*.body' => ['required', 'string', 'max:400'],
            ],
            'about_cta' => [
                'eyebrow' => ['required', 'string', 'max:120'],
                'title' => ['required', 'string', 'max:255'],
                'body' => ['required', 'string', 'max:1000'],
                'button_label' => ['required', 'string', 'max:80'],
                'button_url' => ['required', 'string', 'max:255'],
                'phone_label' => ['required', 'string', 'max:40'],
                'phone_href' => ['required', 'string', 'max:80'],
            ],
            'services_hero', 'why_hero', 'contact_hero' => [
                'meta_title' => ['required', 'string', 'max:160'],
                'meta_description' => ['required', 'string', 'max:300'],
                'og_description' => ['required', 'string', 'max:300'],
                'eyebrow' => ['required', 'string', 'max:120'],
                'title' => ['required', 'string', 'max:255'],
                'body' => ['required', 'string', 'max:2000'],
            ],
            'services_grid', 'why_reasons' => [
                'items' => ['required', 'array', 'min:0', 'max:12'],
                'items.*.icon' => ['required', 'string', Rule::in([
                    'Phone', 'Send', 'ShieldCheck', 'Map', 'Globe', 'Server', 'Sparkles',
                    'GraduationCap', 'Heart', 'Award', 'Users', 'Clock', 'Mail', 'MapPin',
                ])],
                'items.*.title' => ['required', 'string', 'max:160'],
                'items.*.body' => ['required', 'string', 'max:4000'],
            ],
            'services_included' => [
                'eyebrow' => ['nullable', 'string', 'max:120'],
                'title' => ['required', 'string', 'max:255'],
                'intro_paragraphs' => ['required', 'array', 'min:1', 'max:8'],
                'intro_paragraphs.*' => ['required', 'string', 'max:2000'],
                'list_intro' => ['required', 'string', 'max:255'],
                'items' => ['required', 'array', 'min:1', 'max:16'],
                'items.*' => ['required', 'string', 'max:255'],
                'closing_paragraphs' => ['required', 'array', 'min:1', 'max:8'],
                'closing_paragraphs.*' => ['required', 'string', 'max:2000'],
            ],
            'services_cta', 'why_cta' => [
                'eyebrow' => ['nullable', 'string', 'max:120'],
                'title' => ['required', 'string', 'max:255'],
                'body' => ['required', 'string', 'max:2000'],
                'button_label' => ['required', 'string', 'max:80'],
                'button_url' => ['required', 'string', 'max:255'],
                'phone_label' => ['required', 'string', 'max:40'],
                'phone_href' => ['required', 'string', 'max:80'],
            ],
            'why_quote' => [
                'title' => ['required', 'string', 'max:255'],
                'body' => ['required', 'string', 'max:4000'],
                'quote' => ['required', 'string', 'max:2000'],
                'quote_author' => ['required', 'string', 'max:120'],
                'quote_role' => ['required', 'string', 'max:160'],
            ],
            'contact_info' => [
                'intro_title' => ['required', 'string', 'max:160'],
                'intro_paragraphs' => ['required', 'array', 'min:1', 'max:8'],
                'intro_paragraphs.*' => ['required', 'string', 'max:2000'],
                'methods' => ['required', 'array', 'min:1', 'max:8'],
                'methods.*.icon' => ['required', 'string', Rule::in(['Phone', 'Mail', 'MapPin', 'Clock', 'Heart'])],
                'methods.*.label' => ['required', 'string', 'max:80'],
                'methods.*.value' => ['required', 'string', 'max:160'],
                'methods.*.href' => ['nullable', 'string', 'max:255'],
                'form_title' => ['required', 'string', 'max:160'],
                'success_title' => ['required', 'string', 'max:120'],
                'success_body' => ['required', 'string', 'max:300'],
                'name_label' => ['required', 'string', 'max:80'],
                'name_placeholder' => ['nullable', 'string', 'max:120'],
                'home_label' => ['required', 'string', 'max:80'],
                'home_placeholder' => ['nullable', 'string', 'max:120'],
                'email_label' => ['required', 'string', 'max:80'],
                'email_placeholder' => ['nullable', 'string', 'max:120'],
                'phone_label' => ['required', 'string', 'max:80'],
                'phone_placeholder' => ['nullable', 'string', 'max:120'],
                'message_label' => ['required', 'string', 'max:120'],
                'message_placeholder' => ['nullable', 'string', 'max:255'],
                'submit_label' => ['required', 'string', 'max:80'],
                'prefer_text' => ['required', 'string', 'max:120'],
                'prefer_phone_label' => ['required', 'string', 'max:40'],
                'prefer_phone_href' => ['required', 'string', 'max:80'],
                'prefer_email_label' => ['required', 'string', 'max:120'],
                'prefer_email_href' => ['required', 'string', 'max:160'],
            ],
            default => [],
        };
    }

    /**
     * @return array<string, mixed>
     */
    public function contentPayload(): array
    {
        $data = $this->validated();
        unset($data['image'], $data['_method'], $data['remove_image']);

        foreach ([
            'name_placeholder',
            'home_placeholder',
            'email_placeholder',
            'phone_placeholder',
            'message_placeholder',
        ] as $field) {
            if (array_key_exists($field, $data)) {
                $data[$field] = $data[$field] ?? '';
            }
        }

        return $data;
    }

    public function shouldRemoveImage(): bool
    {
        return $this->boolean('remove_image');
    }
}
