<?php

declare(strict_types=1);

namespace App\Services\Promotions;

use App\Models\Promotion;
use App\Models\Producto;
use Carbon\Carbon;

class PromotionEngine
{
    public function findApplicablePromotionForProduct(int $productId, float $quantity, ?Carbon $at = null): ?Promotion
    {
        $timestamp = $at ?? Carbon::now();
        $product = Producto::query()->find($productId);

        if (!$product) {
            return null;
        }

        $candidates = Promotion::query()
            ->where('is_active', true)
            ->where('valid_from', '<=', $timestamp)
            ->where(function ($query) use ($timestamp) {
                $query->whereNull('valid_until')->orWhere('valid_until', '>=', $timestamp);
            })
            ->where(function ($query) use ($quantity) {
                $query->whereNull('min_quantity')->orWhere('min_quantity', '<=', $quantity);
            })
            ->orderByDesc('priority')
            ->orderByDesc('valid_from')
            ->get();

        $byScope = [
            Promotion::SCOPE_PRODUCT => $candidates->first(fn (Promotion $promotion) => $promotion->scope_type === Promotion::SCOPE_PRODUCT && (int) $promotion->scope_id === $productId),
            Promotion::SCOPE_CATEGORY => null,
            Promotion::SCOPE_GLOBAL => $candidates->first(fn (Promotion $promotion) => $promotion->scope_type === Promotion::SCOPE_GLOBAL),
        ];

        if ($product->categoria) {
            $categoryId = (int) $product->categoria;
            $byScope[Promotion::SCOPE_CATEGORY] = $candidates->first(
                fn (Promotion $promotion) => $promotion->scope_type === Promotion::SCOPE_CATEGORY && (int) $promotion->scope_id === $categoryId
            );
        }

        return $byScope[Promotion::SCOPE_PRODUCT]
            ?? $byScope[Promotion::SCOPE_CATEGORY]
            ?? $byScope[Promotion::SCOPE_GLOBAL];
    }
}
