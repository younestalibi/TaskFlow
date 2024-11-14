<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Middleware\JwtMiddleware;

// Register route
Route::post('register', [AuthController::class, 'register']);

// Login route
Route::post('login', [AuthController::class, 'login']);

// Logout route (protected by JWT)
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');

// User route (protected by JWT)

Route::middleware([JwtMiddleware::class])->group(function () {
    Route::get('me', [AuthController::class, 'getUser']);
});


Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
