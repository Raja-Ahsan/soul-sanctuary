<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\UpdateHomeSectionRequest;
use App\Services\HomeContentService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HomeContentController extends Controller
{
    public function __construct(
        private readonly HomeContentService $homeContent,
    ) {}

    public function index(): RedirectResponse
    {
        return redirect()->route('dashboard.home.edit', ['section' => 'banner']);
    }

    public function edit(string $section): Response
    {
        $group = $this->homeContent->groupFor($section);

        abort_unless($group !== null, 404);

        $routes = $this->homeContent->routesFor($group);

        return Inertia::render('Dashboard/Home/EditSection', [
            'section' => $this->homeContent->getForAdmin($section),
            'group' => $group,
            'groupLabel' => $routes['label'],
            'updateUrl' => route($routes['update'], $section, false),
            'sections' => collect($this->homeContent->registry($group))
                ->map(fn (array $meta, string $key) => [
                    'key' => $key,
                    'label' => $meta['label'],
                    'description' => $meta['description'],
                    'href' => route($routes['edit'], $key, false),
                ])
                ->values()
                ->all(),
        ]);
    }

    public function update(UpdateHomeSectionRequest $request, string $section): RedirectResponse
    {
        $group = $this->homeContent->groupFor($section);

        abort_unless($group !== null, 404);

        $this->homeContent->update(
            $section,
            $request->contentPayload(),
            $request->file('image'),
            $request->shouldRemoveImage(),
        );

        $routes = $this->homeContent->routesFor($group);

        return redirect()
            ->route($routes['edit'], $section)
            ->with('success', 'Section updated successfully.');
    }
}
