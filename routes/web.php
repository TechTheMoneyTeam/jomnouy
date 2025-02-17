<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;

Route::post('/api/projects', [ProjectController::class, 'store']);
Route::get('/', function () {
    return view('welcome');
});
Route::get('/services', function () {
    return view('welco');
});
