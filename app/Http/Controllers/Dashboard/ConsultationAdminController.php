<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConsultationAdminController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard/Consultations/Index', [
            'items' => Consultation::query()->orderByDesc('created_at')->get(),
        ]);
    }

    public function update(Request $request, Consultation $consultation): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:new,read,replied,archived'],
        ]);

        $consultation->update($data);

        return back()->with('success', 'Status updated.');
    }

    public function destroy(Consultation $consultation): RedirectResponse
    {
        $consultation->delete();

        return back()->with('success', 'Consultation deleted.');
    }
}
