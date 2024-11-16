<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskListController;
use App\Http\Middleware\JwtMiddleware;


Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::middleware([JwtMiddleware::class])->group(function () {
    Route::get('me', [AuthController::class, 'getUser']);
    Route::post('logout', [AuthController::class, 'logout']);
    // Profile-related routes
    Route::put('profile/update', [ProfileController::class, 'updateProfile']);
    Route::put('profile/update-password', [ProfileController::class, 'updatePassword']);
    Route::delete('profile/delete', [ProfileController::class, 'deleteAccount']);
    // TaskList-related routes
    Route::resource('tasklists', TaskListController::class);
    Route::get('autocomplete', [TaskListController::class, 'autocomplete']);
    Route::post('tasklists/{taskListId}/share', [TaskListController::class, 'shareTaskList']);
    Route::get('tasklists/shared/get', [TaskListController::class, 'getSharedTaskList']);

    Route::resource('tasks', TaskController::class);
    Route::put('tasks/{task}/update-status', [TaskController::class, 'updateStatus']);
});


Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
