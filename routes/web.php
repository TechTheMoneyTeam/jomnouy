<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::post('/api/signup', [UserController::class, 'Save']);
Route::post('/api/login', [UserController::class, 'Login']);

// Route::post('/api/login', [UserController::class, 'Login']);

Route::get('/', function () {
    return view('welcome');
});
