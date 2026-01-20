<?php

use Illuminate\Support\Facades\Route;

// Página principal - usar el estilo del frontend estático
Route::view('/', 'index')->name('home');

// Frontend routes - vistas Blade con el estilo del frontend estático
Route::view('/index', 'index')->name('index');
Route::view('/login', 'login')->name('login');
Route::view('/register', 'register')->name('register');
Route::view('/usuario', 'usuario')->name('usuario');
Route::view('/calendario', 'calendario')->name('calendario');
Route::view('/preguntas-frecuentes', 'preguntasFrecuentes')->name('preguntasFrecuentes');
