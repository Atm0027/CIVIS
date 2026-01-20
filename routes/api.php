<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\VideoController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\DeadlineController;

// públicas
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/videos', [VideoController::class, 'index']);
Route::get('/videos/{id}', [VideoController::class, 'show']);
Route::get('/faqs', [FaqController::class, 'index']);
Route::get('/deadlines', [DeadlineController::class, 'index']);
Route::get('/deadlines/{id}', [DeadlineController::class, 'show']);

// auth
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // aquí luego metemos CRUD admin (crear/editar/borrar)
});

use App\Http\Controllers\Api\UploadController;

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/uploads', [UploadController::class, 'store']);
    Route::delete('/uploads/{upload}', [UploadController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->get('/uploads', [UploadController::class, 'index']);
