<?php

namespace Database\Seeders;

use App\Services\HomeContentService;
use Illuminate\Database\Seeder;

class HomeSectionSeeder extends Seeder
{
    public function run(): void
    {
        app(HomeContentService::class)->ensureDefaults();
    }
}
