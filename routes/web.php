<?php

use Illuminate\Support\Facades\Route;

// Redirigir rutas de blade a archivos estáticos en public/
Route::get('/', function () {
    return redirect('/index.html');
});
