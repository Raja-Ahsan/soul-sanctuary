<?php

namespace Database\Seeders;

use App\Services\PageContentService;
use Illuminate\Database\Seeder;

class PageContentSeeder extends Seeder
{
    public function run(): void
    {
        app(PageContentService::class)->ensureDefaults();
    }
}
