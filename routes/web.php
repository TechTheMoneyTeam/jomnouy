<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\ProfileController;

Route::get('/profile', [ProfileController::class, 'getProfile']);
Route::post('/profile/update', [ProfileController::class, 'updateProfile']);

Route::get('/api/settings', [SettingsController::class, 'getSettings']);
Route::post('/api/settings/change-password', [SettingsController::class, 'changePassword']);

Route::post('/api/projects', [ProjectController::class, 'store']);
Route::get('/api/projects', [ProjectController::class, 'index']);
Route::get('/', function () {
    return view('welcome');
});
Route::get('/user', function () {
    return view('welcome');
});
Route::get('/api/users/{userId}/projects', [ProjectController::class, 'getUserProjects']);
Route::get('/services', function () {
    return view('welcome');
});
Route::get('/login', function () {
    return view('welcome');
});
Route::get('/signup', function () {
    return view('welcome');
});
Route::get('/about', function () {
    return view('welcome');
});
Route::get('/settings', function () {
    return view('welcome');
});
Route::get('/projectlist1', function () {
    return view('welcome');
});
Route::get('/profile/edit', function () {
    return view('welcome');
});
Route::get('/projectsubmit', function () {
    return view('welcome');
});
Route::get('/profile', function () {
    return view('welcome');
});

use App\Http\Controllers\UserController;
Route::post('/api/update-user-type', [UserController::class, 'updateUserType']);

Route::post('/api/signup', [UserController::class, 'signup']);
Route::post('/api/login', [UserController::class, 'login']);
;