<?php

use Illuminate\Support\Facades\Route;

// Main application route (existing backend app)
Route::view('/', 'app');

// Frontend routes (migrated from main branch)
Route::view('/index', 'index')->name('index');
Route::view('/login', 'login')->name('login');
Route::view('/register', 'register')->name('register');
Route::view('/usuario', 'usuario')->name('usuario');
Route::view('/calendario', 'calendario')->name('calendario');
Route::view('/preguntas-frecuentes', 'preguntasFrecuentes')->name('preguntasFrecuentes');
