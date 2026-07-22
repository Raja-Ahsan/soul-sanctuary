<?php

namespace App\Http\Controllers;

use App\Services\HomeContentService;
use Inertia\Inertia;
use Inertia\Response;

class WhySoul SanctuaryController extends Controller
{
    public function __invoke(HomeContentService $homeContent): Response
    {
        return Inertia::render('WhySoul Sanctuary', [
            'sections' => $homeContent->allForPublic('why'),
        ]);
    }
}
