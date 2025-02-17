<?php
use App\Http\Controllers\ProjectController;

Route::post('/projects', [ProjectController::class, 'store']);
Route::get('/project-types', [ProjectController::class, 'getProjectTypes']);
Route::get('/categories', [ProjectController::class, 'getCategories']);
Route::post('/projects/upload', [ProjectController::class, 'uploadFile']);