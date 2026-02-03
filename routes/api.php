<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\VideoController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\DeadlineController;

// públicas
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
    Route::post('/uploads', [UploadController::class, 'store']);
    Route::delete('/uploads/{upload}', [UploadController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->get('/uploads', [UploadController::class, 'index']);
