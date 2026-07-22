<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Reflection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ReflectionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard/Reflections/Index', [
            'items' => Reflection::query()->orderByDesc('created_at')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        Reflection::query()->create($data);

        return back()->with('success', 'Reflection created.');
    }

    public function update(Request $request, Reflection $reflection): RedirectResponse
    {
        $reflection->update($this->validated($request, $reflection));

        return back()->with('success', 'Reflection updated.');
    }

    public function destroy(Reflection $reflection): RedirectResponse
    {
        $reflection->delete();

        return back()->with('success', 'Reflection deleted.');
    }

    /**
     * @return array{slug: string, tag: ?string, title: string, excerpt: ?string, body: ?string, cover_image: ?string, published: bool, published_at: ?\Illuminate\Support\Carbon}
     */
    private function validated(Request $request, ?Reflection $existing = null): array
    {
        $data = $request->validate([
            'slug' => ['nullable', 'string', 'max:255'],
            'tag' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'body' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:2048'],
            'published' => ['sometimes', 'boolean'],
        ]);

        $slug = $data['slug'] ?? null;
        if (! $slug) {
            $slug = Str::slug($data['title']);
        }

        $published = (bool) ($data['published'] ?? false);
        $publishedAt = $existing?->published_at;
        if ($published && ! $publishedAt) {
            $publishedAt = now();
        }
        if (! $published) {
            $publishedAt = null;
        }

        return [
            'slug' => $slug,
            'tag' => $data['tag'] ?? null,
            'title' => $data['title'],
            'excerpt' => $data['excerpt'] ?? null,
            'body' => $data['body'] ?? null,
            'cover_image' => $data['cover_image'] ?? null,
            'published' => $published,
            'published_at' => $publishedAt,
        ];
    }
}
