<?php

namespace App\Http\Controllers;

use App\Models\Animal;
use App\Models\Offering;
use App\Models\Reflection;
use App\Services\PageContentService;
use Inertia\Inertia;
use Inertia\Response;

class SanctuaryPageController extends Controller
{
    public function __construct(
        private readonly PageContentService $pages,
    ) {}

    public function home(): Response
    {
        $content = $this->pages->forPublic('home');

        return Inertia::render('Home', [
            'content' => $content['text'],
            'images' => $content['images'],
            'sections' => $content['sections'],
        ]);
    }

    public function offerings(): Response
    {
        $content = $this->pages->forPublic('offerings');

        return Inertia::render('Offerings', [
            'content' => $content['text'],
            'images' => $content['images'],
            'sections' => $content['sections'],
            'items' => Offering::query()
                ->where('visible', true)
                ->orderBy('sort_order')
                ->orderBy('created_at')
                ->get(),
        ]);
    }

    public function animals(): Response
    {
        $content = $this->pages->forPublic('the-animals');

        return Inertia::render('Animals', [
            'content' => $content['text'],
            'images' => $content['images'],
            'sections' => $content['sections'],
            'items' => Animal::query()
                ->where('visible', true)
                ->orderBy('sort_order')
                ->orderBy('created_at')
                ->get(),
        ]);
    }

    public function reflections(): Response
    {
        $content = $this->pages->forPublic('reflections');

        return Inertia::render('Reflections', [
            'content' => $content['text'],
            'images' => $content['images'],
            'sections' => $content['sections'],
            'items' => Reflection::query()
                ->where('published', true)
                ->orderByDesc('published_at')
                ->get(),
        ]);
    }

    public function sophiaScrolls(): Response
    {
        $content = $this->pages->forPublic('sophia-scrolls');

        return Inertia::render('SophiaScrolls', [
            'content' => $content['text'],
            'images' => $content['images'],
            'sections' => $content['sections'],
        ]);
    }

    public function consultation(): Response
    {
        return Inertia::render('Consultation');
    }

    public function contact(): Response
    {
        $content = $this->pages->forPublic('contact');

        return Inertia::render('Contact', [
            'content' => $content['text'],
            'images' => $content['images'],
            'sections' => $content['sections'],
        ]);
    }
}
