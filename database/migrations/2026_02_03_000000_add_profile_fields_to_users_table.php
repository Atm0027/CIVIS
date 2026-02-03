<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('dni');
            $table->date('dateOfBirth')->nullable()->after('phone');
            $table->string('address')->nullable()->after('dateOfBirth');
            $table->string('city')->nullable()->after('address');
            $table->string('postalCode')->nullable()->after('city');
            $table->string('province')->nullable()->after('postalCode');
            $table->text('relevantData')->nullable()->after('province');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'dateOfBirth',
                'address',
                'city',
                'postalCode',
                'province',
                'relevantData'
            ]);
        });
    }
};
