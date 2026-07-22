<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Animal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnimalController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard/Animals/Index', [
            'items' => Animal::query()->orderBy('sort_order')->orderBy('created_at')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        Animal::query()->create($data);

        return back()->with('success', 'Animal created.');
    }

    public function update(Request $request, Animal $animal): RedirectResponse
    {
        $animal->update($this->validated($request));

        return back()->with('success', 'Animal updated.');
    }

    public function destroy(Animal $animal): RedirectResponse
    {
        $animal->delete();

        return back()->with('success', 'Animal deleted.');
    }

    /**
     * @return array{name: string, species: ?string, story: ?string, image_url: ?string, sort_order: int, visible: bool}
     */
    private function validated(Request $request): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'species' => ['nullable', 'string', 'max:255'],
            'story' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'visible' => ['sometimes', 'boolean'],
        ]);

        return [
            'name' => $data['name'],
            'species' => $data['species'] ?? null,
            'story' => $data['story'] ?? null,
            'image_url' => $data['image_url'] ?? null,
            'sort_order' => (int) ($data['sort_order'] ?? 0),
            'visible' => (bool) ($data['visible'] ?? true),
        ];
    }
}
