<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\PageContentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageContentController extends Controller
{
    public function __construct(
        private readonly PageContentService $pages,
    ) {}

    public function index(): RedirectResponse
    {
        return redirect()->route('dashboard.layout.edit', ['section' => 'header']);
    }

    public function edit(string $page, string $section): Response
    {
        abort_unless($this->pages->pageExists($page), 404);
        $group = $this->pages->section($page, $section);
        abort_unless($group !== null, 404);

        $isLayout = $page === 'layout';
        $updateRoute = $isLayout
            ? route('dashboard.layout.update', $section, false)
            : route('dashboard.pages.update', [$page, $section], false);

        return Inertia::render('Dashboard/Pages/Edit', [
            'pageSlug' => $page,
            'pageLabel' => $this->pages->definition($page)['label'],
            'sectionKey' => $section,
            'sectionTitle' => $group['title'],
            'sectionDescription' => $group['description'] ?? '',
            'fields' => $group['fields'],
            'rows' => $this->pages->forAdminSection($page, $section),
            'sections' => $this->pages->sectionNav($page),
            'updateUrl' => $updateRoute,
            'groupLabel' => $isLayout ? 'Site layout' : ($this->pages->definition($page)['label'].' page'),
        ]);
    }

    public function update(Request $request, string $page, string $section): RedirectResponse
    {
        abort_unless($this->pages->pageExists($page), 404);
        abort_unless($this->pages->section($page, $section) !== null, 404);

        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.key' => ['required', 'string'],
            'items.*.value' => ['nullable', 'string'],
            'items.*.image_url' => ['nullable', 'string'],
        ]);

        $allowedKeys = collect($this->pages->section($page, $section)['fields'])
            ->pluck('key')
            ->all();

        $items = collect($validated['items'])
            ->filter(fn (array $item) => in_array($item['key'], $allowedKeys, true))
            ->values()
            ->all();

        $this->pages->save($page, $items);

        $route = $page === 'layout' ? 'dashboard.layout.edit' : 'dashboard.pages.edit';
        $params = $page === 'layout'
            ? ['section' => $section]
            : ['page' => $page, 'section' => $section];

        return redirect()
            ->route($route, $params)
            ->with('success', 'Section updated successfully.');
    }
}
