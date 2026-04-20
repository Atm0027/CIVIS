<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

// Health check con validación real de base de datos
$healthHandler = function () {
    $dbOk = false;
    $dbError = null;
    $videoCount = 0;

    try {
        DB::connection()->getPdo();
        $dbOk = true;
        $videoCount = DB::table('videos')->count();
    } catch (\Exception $e) {
        $dbError = $e->getMessage();
    }

    $status = $dbOk ? 'ok' : 'degraded';
    $httpCode = $dbOk ? 200 : 503;

    return Response::json([
        'status'      => $status,
        'timestamp'   => Carbon::now()->toIso8601String(),
        'database'    => $dbOk ? 'connected' : 'error',
        'db_error'    => $dbError,
        'video_count' => $videoCount,
        'php_version' => PHP_VERSION,
    ], $httpCode);
};

// Render usa /health-check como healthCheckPath
Route::get('/health-check', $healthHandler);
// También mantener /health por compatibilidad
Route::get('/health', $healthHandler);

Route::get('/', function () {
    return Response::json([
        'api'     => 'CIVIS Backend API',
        'status'  => 'active',
        'version' => '1.0'
    ]);
});
