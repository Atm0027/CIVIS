<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Video;
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

        // =========================
        // VIDEOS (10)
        // =========================
        Video::insert([
            [
                'title' => 'Cómo solicitar una beca',
                'description' => 'Guía paso a paso para solicitar becas oficiales',
                'url' => 'https://www.youtube.com/watch?v=video1',
                'duration' => 420,
                'category_id' => $studies->id,
                'published' => true,
            ],
            [
                'title' => 'Acceso a la universidad',
                'description' => 'Opciones de acceso a la universidad en España',
                'url' => 'https://www.youtube.com/watch?v=video2',
                'duration' => 380,
                'category_id' => $studies->id,
                'published' => true,
            ],
            [
                'title' => 'Homologación de títulos',
                'description' => 'Cómo homologar títulos extranjeros',
                'url' => 'https://www.youtube.com/watch?v=video3',
                'duration' => 300,
                'category_id' => $studies->id,
                'published' => true,
            ],
            [
                'title' => 'Empadronamiento',
                'description' => 'Cómo empadronarse correctamente',
                'url' => 'https://www.youtube.com/watch?v=video4',
                'duration' => 240,
                'category_id' => $citizenship->id,
                'published' => true,
            ],
            [
                'title' => 'Solicitud de NIE',
                'description' => 'Trámite para obtener el NIE',
                'url' => 'https://www.youtube.com/watch?v=video5',
                'duration' => 260,
                'category_id' => $citizenship->id,
                'published' => true,
            ],
            [
                'title' => 'Tarjeta sanitaria',
                'description' => 'Cómo solicitar la tarjeta sanitaria',
                'url' => 'https://www.youtube.com/watch?v=video6',
                'duration' => 210,
                'category_id' => $citizenship->id,
                'published' => true,
            ],
            [
                'title' => 'Buscar trabajo en España',
                'description' => 'Portales y consejos para buscar empleo',
                'url' => 'https://www.youtube.com/watch?v=video7',
                'duration' => 500,
                'category_id' => $employment->id,
                'published' => true,
            ],
            [
                'title' => 'Cómo hacer un CV',
                'description' => 'Consejos para crear un buen currículum',
                'url' => 'https://www.youtube.com/watch?v=video8',
                'duration' => 450,
                'category_id' => $employment->id,
                'published' => true,
            ],
            [
                'title' => 'Entrevista de trabajo',
                'description' => 'Claves para superar una entrevista',
                'url' => 'https://www.youtube.com/watch?v=video9',
                'duration' => 390,
                'category_id' => $employment->id,
                'published' => true,
            ],
            [
                'title' => 'Contratos laborales',
                'description' => 'Tipos de contratos en España',
                'url' => 'https://www.youtube.com/watch?v=video10',
                'duration' => 360,
                'category_id' => $employment->id,
                'published' => true,
            ],
        ]);

        // =========================
        // FAQS (10)
        // =========================
        for ($i = 1; $i <= 10; $i++) {
            Faq::create([
                'question' => "Pregunta frecuente $i",
                'answer' => "Respuesta detallada de la pregunta frecuente número $i.",
                'published' => true,
            ]);
        }
    }
}
