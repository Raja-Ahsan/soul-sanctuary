<?php

namespace App\Http\Controllers;

use App\Services\HomeContentService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(HomeContentService $homeContent): Response
    {
        return Inertia::render('Home', [
            'sections' => $homeContent->allForPublic(),
        ]);
    }
}
