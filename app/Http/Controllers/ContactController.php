<?php

namespace App\Http\Controllers;

use App\Services\HomeContentService;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function __invoke(HomeContentService $homeContent): Response
    {
        return Inertia::render('Contact', [
            'sections' => $homeContent->allForPublic('contact'),
        ]);
    }
}
