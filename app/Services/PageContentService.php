<?php

namespace App\Services;

use App\Models\PageContent;
use Illuminate\Support\Facades\DB;

class PageContentService
{
    /**
     * @return array<string, array{label: string, groups: list<array{key: string, title: string, description?: string, fields: list<array{key: string, label: string, type: string, default?: string}>}>}>
     */
    public function pages(): array
    {
        return config('page-schema', []);
    }

    public function pageExists(string $slug): bool
    {
        return array_key_exists($slug, $this->pages());
    }

    /**
     * @return array{label: string, groups: list<array{key: string, title: string, description?: string, fields: list<array{key: string, label: string, type: string, default?: string}>}>}|null
     */
    public function definition(string $slug): ?array
    {
        return $this->pages()[$slug] ?? null;
    }

    /**
     * @return array{key: string, title: string, description?: string, fields: list<array{key: string, label: string, type: string, default?: string}>}|null
     */
    public function section(string $page, string $sectionKey): ?array
    {
        $def = $this->definition($page);

        if ($def === null) {
            return null;
        }

        foreach ($def['groups'] as $group) {
            if (($group['key'] ?? null) === $sectionKey) {
                return $group;
            }
        }

        return null;
    }

    public function firstSectionKey(string $page): ?string
    {
        $def = $this->definition($page);

        return $def['groups'][0]['key'] ?? null;
    }

    /**
     * @return list<array{key: string, label: string, description: string, href: string}>
     */
    public function sectionNav(string $page): array
    {
        $def = $this->definition($page);

        if ($def === null) {
            return [];
        }

        $routeName = $page === 'layout' ? 'dashboard.layout.edit' : 'dashboard.pages.edit';

        return collect($def['groups'])
            ->map(fn (array $group) => [
                'key' => $group['key'],
                'label' => $group['title'],
                'description' => $group['description'] ?? '',
                'href' => route($routeName, $page === 'layout'
                    ? ['section' => $group['key']]
                    : ['page' => $page, 'section' => $group['key']], false),
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<string, string>
     */
    public function defaults(string $slug): array
    {
        $def = $this->definition($slug);
        $out = [];

        if ($def === null) {
            return $out;
        }

        foreach ($def['groups'] as $group) {
            foreach ($group['fields'] as $field) {
                if (array_key_exists('default', $field) && $field['default'] !== null) {
                    $out[$field['key']] = (string) $field['default'];
                }
            }
        }

        return $out;
    }

    /**
     * @return array{text: array<string, string>, images: array<string, string>}
     */
    public function forPublic(string $slug): array
    {
        $text = $this->defaults($slug);
        $images = [];

        PageContent::query()
            ->where('page', $slug)
            ->get(['key', 'value', 'image_url'])
            ->each(function (PageContent $row) use (&$text, &$images) {
                if ($row->value !== null && $row->value !== '') {
                    $text[$row->key] = $row->value;
                }
                if ($row->image_url) {
                    $images[$row->key] = $row->image_url;
                }
            });

        // Fall back to legacy home keys for layout brand/footer if layout rows are empty.
        if ($slug === 'layout') {
            $legacy = PageContent::query()
                ->where('page', 'home')
                ->whereIn('key', ['brand_text', 'footer_copy'])
                ->get(['key', 'value']);

            foreach ($legacy as $row) {
                if (($text[$row->key] ?? '') === ($this->defaults('layout')[$row->key] ?? '') && $row->value) {
                    $text[$row->key] = $row->value;
                }
            }
        }

        return compact('text', 'images');
    }

    /**
     * Shared header/footer for all public pages.
     *
     * @return array{brand_text: string, footer_copy: string}
     */
    public function layoutForPublic(): array
    {
        $layout = $this->forPublic('layout');

        return [
            'brand_text' => $layout['text']['brand_text'] ?? 'SOUL SANCTUARY',
            'footer_copy' => $layout['text']['footer_copy'] ?? ('© '.date('Y').' Sanctuary of the Veil Keepers. All rights reserved.'),
        ];
    }

    /**
     * @return array<string, array{key: string, value: string, image_url: string|null, type: string, label: string}>
     */
    public function forAdminSection(string $page, string $sectionKey): array
    {
        $section = $this->section($page, $sectionKey);
        abort_unless($section !== null, 404);

        $defaults = $this->defaults($page);
        $stored = PageContent::query()
            ->where('page', $page)
            ->get()
            ->keyBy('key');

        // Legacy home → layout migration for brand/footer values.
        if ($page === 'layout') {
            $legacy = PageContent::query()
                ->where('page', 'home')
                ->whereIn('key', ['brand_text', 'footer_copy'])
                ->get()
                ->keyBy('key');
        } else {
            $legacy = collect();
        }

        $rows = [];

        foreach ($section['fields'] as $field) {
            $key = $field['key'];
            $row = $stored->get($key) ?? $legacy->get($key);

            $rows[$key] = [
                'key' => $key,
                'label' => $field['label'],
                'type' => $field['type'],
                'value' => $row?->value ?? ($defaults[$key] ?? ''),
                'image_url' => $row?->image_url,
            ];
        }

        return $rows;
    }

    /**
     * @param  list<array{key: string, value?: string|null, image_url?: string|null}>  $items
     */
    public function save(string $slug, array $items): void
    {
        abort_unless($this->pageExists($slug), 404);

        DB::transaction(function () use ($slug, $items) {
            foreach ($items as $item) {
                if (! isset($item['key'])) {
                    continue;
                }

                PageContent::query()->updateOrCreate(
                    ['page' => $slug, 'key' => $item['key']],
                    [
                        'value' => $item['value'] ?? null,
                        'image_url' => $item['image_url'] ?? null,
                    ],
                );
            }
        });
    }

    public function ensureDefaults(): void
    {
        foreach ($this->pages() as $slug => $def) {
            $sort = 0;
            foreach ($def['groups'] as $group) {
                foreach ($group['fields'] as $field) {
                    PageContent::query()->firstOrCreate(
                        ['page' => $slug, 'key' => $field['key']],
                        [
                            'value' => $field['default'] ?? null,
                            'image_url' => null,
                            'label' => $field['label'],
                            'sort_order' => $sort++,
                        ],
                    );
                }
            }
        }
    }
}
