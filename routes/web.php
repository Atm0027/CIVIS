<?php

use Illuminate\Support\Facades\Route;

// Redirigir rutas de blade a archivos estáticos en public/
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()]);
});

Route::get('/', function () {
    return view('welcome');
});
