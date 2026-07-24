<?php

namespace App\Http\Middleware;

use App\Services\PageContentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
            ],
            'site' => fn () => app(PageContentService::class)->layoutForPublic(),
            'cmsSections' => function () use ($request) {
                if (! $request->user() || ! Schema::hasTable('page_contents')) {
                    return null;
                }

                $service = app(PageContentService::class);
                $maps = [];

                foreach (array_keys($service->pages()) as $slug) {
                    $maps[$slug] = $service->sectionEnabledMap($slug);
                }

                return $maps;
            },
        ];
    }
}
