<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\DebugController;
use App\Http\Controllers\Api\V1\HealthCheckController;
use App\Http\Controllers\Api\V1\MeController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Finance\DailyClosureController;
use App\Http\Controllers\Finance\FixedCostController;
use App\Http\Controllers\Inventory\NewMerchandiseController;
use App\Http\Controllers\Offers\OfferController;
use App\Http\Controllers\Offers\OfferStatsController;
use App\Http\Controllers\Offers\OfferSuggestionController;
use App\Http\Controllers\Pos\CashSessionController;
use App\Http\Controllers\Pos\PosConfigController;
use App\Http\Controllers\Pos\SaleController;
use App\Http\Controllers\Purchasing\PurchaseSuggestionController;
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

Route::prefix('finance')->middleware(['kc.jwt'])->group(function (): void {
    Route::get('/fixed-costs/daily-total', [FixedCostController::class, 'dailyTotal'])
        ->middleware('roles:cajero,admin,superadmin');

    Route::middleware('roles:admin,superadmin')->group(function (): void {
        Route::get('/fixed-costs', [FixedCostController::class, 'index']);
        Route::post('/fixed-costs', [FixedCostController::class, 'store']);
        Route::patch('/fixed-costs/{id}', [FixedCostController::class, 'update']);

        Route::get('/daily-closures/today', [DailyClosureController::class, 'today']);
        Route::get('/daily-closures', [DailyClosureController::class, 'index']);
        Route::post('/daily-closures', [DailyClosureController::class, 'store']);
        Route::get('/daily-closures/{id}', [DailyClosureController::class, 'show']);
    });

    Route::middleware('roles:superadmin')->group(function (): void {
        Route::post('/daily-closures/{id}/annul', [DailyClosureController::class, 'annul']);
    });
});

Route::prefix('offers')->middleware(['kc.jwt'])->group(function (): void {
    Route::middleware('roles:repositor,admin,superadmin')->group(function (): void {
        Route::get('/suggestions', OfferSuggestionController::class);
        Route::get('/active', [OfferController::class, 'active']);
        Route::get('/{id}', [OfferController::class, 'show']);
    });

    Route::middleware('roles:admin,superadmin')->group(function (): void {
        Route::post('/', [OfferController::class, 'store']);
        Route::patch('/{id}', [OfferController::class, 'update']);
        Route::post('/{id}/cancel', [OfferController::class, 'cancel']);
        Route::get('/stats/top', [OfferStatsController::class, 'top']);
    });

    Route::get('/price-for-product/{productId}', [OfferController::class, 'priceForProduct'])
        ->middleware('roles:cajero,repositor,admin,superadmin');
});

Route::prefix('purchasing')->middleware(['kc.jwt'])->group(function (): void {
    Route::middleware('roles:repositor,admin,superadmin')->group(function (): void {
        Route::get('/suggestions', [PurchaseSuggestionController::class, 'index']);
        Route::get('/suggestions/{id}', [PurchaseSuggestionController::class, 'show']);
        Route::get('/suggestions/{id}/export', [PurchaseSuggestionController::class, 'export']);
    });

    Route::middleware('roles:admin,superadmin')->group(function (): void {
        Route::post('/suggestions/generate', [PurchaseSuggestionController::class, 'generate']);
        Route::patch('/suggestions/{id}/items/{itemId}', [PurchaseSuggestionController::class, 'updateItem']);
        Route::post('/suggestions/{id}/confirm', [PurchaseSuggestionController::class, 'confirm']);
        Route::post('/suggestions/{id}/cancel', [PurchaseSuggestionController::class, 'cancel']);
    });
});

Route::prefix('inventory')->middleware(['kc.jwt'])->group(function (): void {
    Route::middleware('roles:admin,superadmin')->group(function (): void {
        Route::get('/pricing-rules', [NewMerchandiseController::class, 'pricingRules']);
    });

    Route::middleware('roles:superadmin')->group(function (): void {
        Route::post('/pricing-rules', [NewMerchandiseController::class, 'storePricingRule']);
        Route::patch('/pricing-rules/{id}', [NewMerchandiseController::class, 'updatePricingRule']);
    });

    Route::middleware('roles:repositor,admin,superadmin')->group(function (): void {
        Route::get('/new-merchandise/config', [NewMerchandiseController::class, 'config']);
        Route::post('/new-merchandise', [NewMerchandiseController::class, 'store']);
        Route::get('/batches', [NewMerchandiseController::class, 'batches']);
        Route::get('/batches/{id}', [NewMerchandiseController::class, 'show']);
    });
});
