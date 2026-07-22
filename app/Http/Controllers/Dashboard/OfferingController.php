<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Offering;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OfferingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard/Offerings/Index', [
            'items' => Offering::query()->orderBy('sort_order')->orderBy('created_at')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Offering::query()->create($this->validated($request));

        return back()->with('success', 'Offering created.');
    }

    public function update(Request $request, Offering $offering): RedirectResponse
    {
        $offering->update($this->validated($request));

        return back()->with('success', 'Offering updated.');
    }

    public function destroy(Offering $offering): RedirectResponse
    {
        $offering->delete();

        return back()->with('success', 'Offering deleted.');
    }

    /**
     * @return array{title: string, tag: ?string, description: ?string, price: ?string, image_url: ?string, sort_order: int, visible: bool}
     */
    private function validated(Request $request): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'tag' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['nullable', 'string', 'max:255'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'visible' => ['sometimes', 'boolean'],
        ]);

        return [
            'title' => $data['title'],
            'tag' => $data['tag'] ?? null,
            'description' => $data['description'] ?? null,
            'price' => $data['price'] ?? null,
            'image_url' => $data['image_url'] ?? null,
            'sort_order' => (int) ($data['sort_order'] ?? 0),
            'visible' => (bool) ($data['visible'] ?? true),
        ];
    }
}
