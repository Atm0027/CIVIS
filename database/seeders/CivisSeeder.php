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

        // =========================
        // VIDEOS
        // =========================
        \App\Models\Video::firstOrCreate(
            ['title' => 'Cómo solicitar la Beca MEC'],
            [
                'description' => 'Guía paso a paso para completar la solicitud de la beca del Ministerio de Educación.',
                'url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'duration' => 330, // 5:30 -> 330 seconds
                'category_id' => $studies->id,
                'published' => true
            ]
        );

        \App\Models\Video::firstOrCreate(
            ['title' => 'Renovación del DNI'],
            [
                'description' => 'Documentación necesaria y pasos para pedir cita previa y renovar tu Documento Nacional de Identidad.',
                'url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'duration' => 195, // 3:15 -> 195 seconds
                'category_id' => $citizenship->id,
                'published' => true
            ]
        );

        \App\Models\Video::firstOrCreate(
            ['title' => 'Alta en el paro (SEPE)'],
            [
                'description' => 'Cómo inscribirse como demandante de empleo en el SEPE de forma telemática.',
                'url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'duration' => 525, // 8:45 -> 525 seconds
                'category_id' => $employment->id,
                'published' => true
            ]
        );

        // =========================
        // DEADLINES
        // =========================
        \App\Models\Deadline::firstOrCreate(
            ['title' => 'Cierre de solicitud Beca MEC'],
            [
                'description' => 'Último día para presentar la solicitud de beca para el próximo curso académico.',
                'start_date' => now()->addDays(15),
                'category_id' => $studies->id
            ]
        );

        \App\Models\Deadline::firstOrCreate(
            ['title' => 'Presentación Declaración Renta'],
            [
                'description' => 'Periodo ordinario para la presentación de la declaración de la renta 2023.',
                'start_date' => now()->addDays(45),
                'category_id' => $employment->id // Usando Empleo como categoría por defecto
            ]
        );

        // =========================
        // FAQS
        // =========================
        \App\Models\Faq::firstOrCreate(
            ['question' => '¿Qué necesito para renovar el DNI?'],
            [
                'answer' => 'Necesitas una fotografía reciente, el DNI anterior y el importe de la tasa en metálico (o justificante de pago).',
                'published' => true
            ]
        );

        \App\Models\Faq::firstOrCreate(
            ['question' => '¿Cómo pido cita para el médico?'],
            [
                'answer' => 'Puedes hacerlo a través de la web del servicio de salud de tu comunidad, por teléfono o mediante la app oficial.',
                'published' => true
            ]
        );
    }
}
