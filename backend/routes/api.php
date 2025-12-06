<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\DebugController;
use App\Http\Controllers\Api\V1\HealthCheckController;
use App\Http\Controllers\Api\V1\MeController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Pos\CashSessionController;
use App\Http\Controllers\Pos\PosConfigController;
use App\Http\Controllers\Pos\SaleController;
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

Route::prefix('pos')->middleware(['kc.jwt', 'roles:cajero,admin,superadmin'])->group(function (): void {
    Route::get('/config', PosConfigController::class);

    Route::post('/cash-sessions/open', [CashSessionController::class, 'open']);
    Route::post('/cash-sessions/close', [CashSessionController::class, 'close']);
    Route::get('/cash-sessions/current', [CashSessionController::class, 'current']);
    Route::middleware('roles:admin,superadmin')->group(function (): void {
        Route::get('/cash-sessions/{id}', [CashSessionController::class, 'show']);
    });

    Route::get('/sales', [SaleController::class, 'index']);
    Route::post('/sales', [SaleController::class, 'store']);
    Route::get('/sales/{id}', [SaleController::class, 'show']);
    Route::middleware('roles:superadmin')->group(function (): void {
        Route::post('/sales/{id}/cancel', [SaleController::class, 'cancel']);
    });
});
