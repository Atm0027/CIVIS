<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Usuario administrador del sistema
        User::updateOrCreate(
            ['email' => 'admin@civis.local'],
            [
                'username' => 'admin',
                'name'     => 'Admin',
                'surname'  => 'Sistema',
                'password' => bcrypt('admin1234'),
                'role'     => 'admin',
            ]
        );
    }
}
