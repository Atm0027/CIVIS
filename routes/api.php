<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\VideoController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\DeadlineController;

// ===== ENDPOINTS DE DIAGNÓSTICO =====

// Ping ultraligero para despertar el servidor (sin DB, respuesta inmediata)
Route::get('/ping', function () {
    return response()->json(['pong' => true, 'ts' => time()]);
});

// Status con comprobación real de base de datos
Route::get('/status', function () {
    $dbOk = false;
    $videoCount = 0;
    $dbError = null;
    try {
        DB::connection()->getPdo();
        $dbOk = true;
        $videoCount = DB::table('videos')->count();
    } catch (\Exception $e) {
        $dbError = $e->getMessage();
    }
    return response()->json([
        'api'         => 'ok',
        'database'    => $dbOk ? 'connected' : 'error',
        'db_error'    => $dbError,
        'video_count' => $videoCount,
    ], $dbOk ? 200 : 503);
});

// públicas
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/videos', [VideoController::class, 'index']);
Route::get('/videos/search', [VideoController::class, 'index']); // Frontend uses /videos/search
Route::get('/videos/{id}', [VideoController::class, 'show']);
Route::get('/faqs', [FaqController::class, 'index']);
Route::get('/faqs/search', [FaqController::class, 'index']); // Frontend uses /faqs/search
Route::get('/deadlines', [DeadlineController::class, 'index']);
Route::get('/deadlines/{id}', [DeadlineController::class, 'show']);

// auth
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // User Profile routes matching frontend
        Route::prefix('user')->group(function () {
            Route::get('/profile', [AuthController::class, 'me']);
            Route::put('/profile', [AuthController::class, 'updateProfile']);
        });
    });
});

// Calendar / Deadlines
Route::get('/calendar', [DeadlineController::class, 'index']);
Route::get('/calendar/upcoming', [DeadlineController::class, 'upcoming']);

use App\Http\Controllers\Api\UploadController;

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/videos', [VideoController::class, 'store']);
    Route::put('/videos/{id}', [VideoController::class, 'update']);
    Route::delete('/videos/bulk', [VideoController::class, 'destroyBulk']);
    Route::delete('/videos/{id}', [VideoController::class, 'destroy']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::post('/uploads', [UploadController::class, 'store']);
    Route::delete('/uploads/{upload}', [UploadController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->get('/uploads', [UploadController::class, 'index']);