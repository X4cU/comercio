<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\DebugController;
use App\Http\Controllers\Api\V1\HealthCheckController;
use App\Http\Controllers\Api\V1\MeController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/health', [HealthCheckController::class, 'index']);
    Route::get('/debug/env', [DebugController::class, 'env'])->middleware('env.local');

    Route::middleware('kc.jwt')->group(function (): void {
        Route::get('/me', [MeController::class, 'show']);
    });
});
