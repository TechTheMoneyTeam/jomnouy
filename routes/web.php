<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\KycVerificationController;
use App\Http\Controllers\FollowingController;




Route::get('/api/projects/by-location', [ProjectController::class, 'getProjectsByLocation']);

Route::get('/api/projects/ending-soon', [ProjectController::class, 'getEndingSoonProject']);

Route::get('/api/following', [FollowingController::class, 'getFollowing']);
Route::get('/api/users/search', [FollowingController::class, 'searchUsers']);
Route::post('/api/follow', [FollowingController::class, 'followUser']);
Route::post('/api/unfollow', [FollowingController::class, 'unfollowUser']);

Route::get('/api/profile', [ProfileController::class, 'getProfile']);
Route::post('/api/profile/update', [ProfileController::class, 'updateProfile']);

Route::get('/api/settings', [SettingsController::class, 'getSettings']);
Route::post('/api/settings/change-password', [SettingsController::class, 'changePassword']);
Route::post('/api/settings/change-password1', [SettingsController::class, 'changePassword1']);

Route::post('/api/projects', [ProjectController::class, 'store']);
Route::get('/api/projects', [ProjectController::class, 'index']);

use App\Http\Controllers\InvestmentController;
Route::get('/api/investments', [InvestmentController::class, 'index']);
Route::get('/api/projects/{projectId}/investments/total', [InvestmentController::class, 'getProjectTotalInvestment']);
    
// Create a new investment
Route::post('/api/investments', [InvestmentController::class, 'store']);

// Get specific investment by ID
Route::get('/api/investments/{id}', [InvestmentController::class, 'show']);

// Update specific investment
Route::put('/api/investments/{id}', [InvestmentController::class, 'update']);
Route::patch('/api/investments/{id}', [InvestmentController::class, 'update']);

// Delete investment
Route::delete('/api/investments/{id}', [InvestmentController::class, 'destroy']);

// Get all investments for a specific project
Route::get('/api/projects/{projectId}/investments', [InvestmentController::class, 'getProjectInvestments']);

// Get all investments for a specific user
Route::get('/api/users/{userId}/investments', [InvestmentController::class, 'getUserInvestments']);
Route::get('/api/project-investments/{projectId}', [InvestmentController::class, 'getProjectInvestments']);
Route::get('/api/investments/user/{userId}', [InvestmentController::class, 'getUserTransactions']);

Route::get('/investments', function () {
    return view('welcome');
});
Route::get('/investments/{id}', function () {
    return view('welcome');
});

// project multi filter
Route::get('/api/filtered-projects', [ProjectController::class, 'getFilteredProjects']);
// project ending soon
// Route::get('/api/projects/ending-soon', [ProjectController::class, 'getEndingSoonProjects']);

// Correct route definition
Route::get('/api/category/{category}', [ProjectController::class, 'getProjectsByCategory']);
// Route::get('/projects/{id}', function () {
//     return view('welcome');
// })->where('id', '[^/]+');
Route::get('/category/{categoryName}', function () {
    return view('welcome');  // Ensure this view contains your React app
})->where('categoryName', '[^/]+');  // Match any category name


 
Route::get('/api/projects/{id}', [ProjectController::class, 'show']);
Route::get('/projects/{id}', function () {
    return view('welcome');
})->where('id', '[^/]+');

Route::resource('/api/kyc-verifications', KycVerificationController::class);

Route::get('/api/projects/type/{type}', [ProjectController::class, 'getProjectsByType']);
Route::get('/api/projects/{id}', [ProjectController::class, 'show']);
Route::get('/api/users/{userId}/projects', [ProjectController::class, 'getUserProjects']);

Route::put('/api/projects/{id}', [ProjectController::class, 'update']);

Route::post('/api/projects/{id}', [ProjectController::class, 'update'])->name('projects.update.form');
Route::delete('/api/projects/{id}', [ProjectController::class, 'destroy']);

Route::get('/', function () {
    return view('welcome');
});
Route::get('/user', function () {
    return view('welcome');
});
Route::get('/edit-project/{id}', function () {
    return view('welcome');
})->where('id', '[0-9]+');
Route::get('/investment-approval-dashboard/{id}', function () {
    return view('welcome');
})->where('id', '[0-9]+');
Route::get('/update/{projectid}', function () {
    return view('welcome');
})->where('id', '[0-9]+');
Route::get('/api/users/{userId}/projects', [ProjectController::class, 'getUserProjects']);
Route::get('/services', function () {
    return view('welcome');
});
Route::get('/login', function () {
    return view('welcome');
});
Route::get('/project-near-you', function () {
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
Route::get('/favorites', function () {
    return view('welcome');
});
Route::get('/project-ending-soon', function () {
    return view('welcome');
});
Route::get('/dashboardInvestor', function () {
    return view('welcome');
});
Route::get('/api/ip-lookup/{ip}', function ($ip) {
    $response = Http::get("https://ipapi.co/{$ip}/json/");
    return $response->json();
});



use App\Http\Controllers\FavoriteController;

Route::get('/api/users/{userId}/favorites', [FavoriteController::class, 'index']);

// Check if a specific project is favorited by user
Route::get('/api/users/{userId}/favorites/{projectId}', [FavoriteController::class, 'check']);

// Add a project to favorites
Route::post('/api/users/{userId}/favorites', [FavoriteController::class, 'store']);

// Remove a project from favorites
Route::delete('/api/users/{userId}/favorites/{projectId}', [FavoriteController::class, 'destroy']);




use App\Http\Controllers\UserController;
Route::post('/api/update-user-type', [UserController::class, 'updateUserType']);
Route::post('/api/forgot-password', [PasswordResetController::class, 'sendResetEmail']);
Route::post('/api/reset-password', [PasswordResetController::class, 'resetPassword']);

Route::post('/api/signup', [UserController::class, 'signup']);
Route::post('/api/login', [UserController::class, 'login']);

Route::get('/api/search', [ProjectController::class, 'search']);

use App\Http\Controllers\UpdateController;
Route::get('/api/updates/{investorId}', [UpdateController::class, 'getInvestorUpdates1']);


Route::post('/api/updates-progress', [UpdateController::class, 'store']);
// Route::post('/api/updates', [UpdateController::class, 'store']);
Route::get('/updates/{projectId}', [UpdateController::class, 'index']);

//route for invested project for investor 
Route::get('/api/investor/{id}/projects', [InvestmentController::class, 'getInvestorData']);
// Route::get('/api/investor/{id}/investment', [InvestmentController::class, 'getInvestmentsByInvestor']);

//route for update  and report  project for investor 
Route::get('/api/investor/{investorId}/updates-report', [UpdateController::class, 'getInvestorUpdates1']);
