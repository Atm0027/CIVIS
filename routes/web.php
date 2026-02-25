<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;
use Carbon\Carbon;

// Redirigir rutas de blade a archivos estáticos en public/
Route::get('/health', function () {
    return Response::json(['status' => 'ok', 'timestamp' => Carbon::now()]);
});

Route::get('/', function () {
    return Response::json([
        'api' => 'CIVIS Backend API',
        'status' => 'active',
        'version' => '1.0'
    ]);
});
