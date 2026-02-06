<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

use App\Models\Faq;
use App\Models\Deadline;

class CivisSeeder extends Seeder
{
    public function run(): void
    {
        // =========================
        // CATEGORIES (3)
        // =========================
        $studies = Category::firstOrCreate(
            ['slug' => 'estudios'],
            ['name' => 'Estudios']
        );

        $citizenship = Category::firstOrCreate(
            ['slug' => 'ciudadania'],
            ['name' => 'Ciudadanía']
        );

        $employment = Category::firstOrCreate(
            ['slug' => 'empleo'],
            ['name' => 'Empleo']
        );



    }
}
