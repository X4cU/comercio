<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\DebugController;
use App\Http\Controllers\Api\V1\HealthCheckController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/health', [HealthCheckController::class, 'index']);
    Route::get('/debug/env', [DebugController::class, 'env'])->middleware('env.local');
});
