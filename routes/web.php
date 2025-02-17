<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\ProjectController;  

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-db', function () {
    try {
        DB::connection()->getPdo();
        return "Connected successfully to: " . DB::connection()->getDatabaseName();
    } catch (\Exception $e) {
        return "Could not connect to the database. Error: " . $e->getMessage();
    }
});


Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
