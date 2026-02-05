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
        $studies = Category::create([
            'name' => 'Estudios',
            'slug' => 'estudios',
        ]);

        $citizenship = Category::create([
            'name' => 'Ciudadanía',
            'slug' => 'ciudadania',
        ]);

        $employment = Category::create([
            'name' => 'Empleo',
            'slug' => 'empleo',
        ]);



    }
}