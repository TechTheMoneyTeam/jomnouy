<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PasswordResetController;

Route::get('/api/profile', [ProfileController::class, 'getProfile']);
Route::post('/api/profile/update', [ProfileController::class, 'updateProfile']);

Route::get('/api/settings', [SettingsController::class, 'getSettings']);
Route::post('/api/settings/change-password', [SettingsController::class, 'changePassword']);
Route::post('/api/settings/change-password1', [SettingsController::class, 'changePassword1']);
use App\Http\Controllers\UserController;

Route::post('/api/projects', [ProjectController::class, 'store']);
Route::get('/api/projects', [ProjectController::class, 'index']);

Route::get('/api/projects/type/{type}', [ProjectController::class, 'getProjectsByType']);
Route::get('/api/projects/{id}', [ProjectController::class, 'show']);
Route::get('/api/users/{userId}/projects', [ProjectController::class, 'getUserProjects']);

Route::post('/api/projects/{id}', [ProjectController::class, 'update']);
Route::delete('/api/projects/{id}', [ProjectController::class, 'destroy']);

Route::get('/api/projects/{id}', [ProjectController::class, 'show']);
Route::get('/projects/{id}', function () {
    return view('welcome');
})->where('id', '[^/]+');

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
Route::get('/reset', function () {
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
Route::get('/my-project', function () {
    return view('welcome');
});
Route::get('/projectlist1', function () {
    return view('welcome');
});
Route::get('/profile/edit', function () {
    return view('welcome');
});
Route::get('/existing', function () {
    return view('welcome');
});
Route::get('/startup', function () {
    return view('welcome');
});
Route::get('/create', function () {
    return view('welcome');
});
Route::get('/profile', function () {
    return view('welcome');
});
Route::get('/noti', function () {
    return view('welcome');
});
Route::get('/followings', function () {
    return view('welcome');
});
Route::get('/contact', function () {
    return view('welcome');
});

Route::get('/projects', function () {
    return view('welcome');
});

Route::post('/api/update-user-type', [UserController::class, 'updateUserType']);
Route::post('/api/forgot-password', [PasswordResetController::class, 'sendResetEmail']);
Route::post('/api/reset-password', [PasswordResetController::class, 'resetPassword']);

Route::post('/api/signup', [UserController::class, 'signup']);
Route::post('/api/login', [UserController::class, 'login']);
;