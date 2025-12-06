<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\DebugController;
use App\Http\Controllers\Api\V1\HealthCheckController;
use App\Http\Controllers\Api\V1\MeController;
use App\Http\Controllers\Api\ProductoController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/health', [HealthCheckController::class, 'index']);
    Route::get('/debug/env', [DebugController::class, 'env'])->middleware('env.local');

    Route::middleware('kc.jwt')->group(function (): void {
        Route::get('/me', [MeController::class, 'show']);
    });
});

Route::middleware('kc.jwt')->group(function (): void {
    Route::get('/productos', [ProductoController::class, 'index']);
    Route::get('/productos/{id}', [ProductoController::class, 'show']);

    Route::middleware('role.superadmin')->group(function (): void {
        Route::post('/productos', [ProductoController::class, 'store']);
        Route::put('/productos/{id}', [ProductoController::class, 'update']);
        Route::patch('/productos/{id}/estado', [ProductoController::class, 'toggleEstado']);
    });
});
