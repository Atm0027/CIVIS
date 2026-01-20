<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@civis.local'],
            [
                'name' => 'Admin',
                'password' => bcrypt('admin1234'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'user@civis.local'],
            [
                'name' => 'Usuario',
                'password' => bcrypt('user1234'),
                'role' => 'user',
            ]
        );

        // Si tienes tu seeder de datos:
        if (class_exists(\Database\Seeders\CivisSeeder::class)) {
            $this->call(\Database\Seeders\CivisSeeder::class);
        }
    }
}
