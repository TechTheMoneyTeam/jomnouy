<?php
use App\Http\Controllers\ProjectController;

Route::middleware('auth:api')->group(function () {
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::post('/upload', [ProjectController::class, 'uploadFile']);
});
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
