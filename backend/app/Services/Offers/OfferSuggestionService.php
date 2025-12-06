<?php

declare(strict_types=1);

namespace App\Services\Offers;

use App\Models\ProductOffer;
use App\Models\Producto;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class OfferSuggestionService
{
    public function getSuggestions(array $filters = []): Collection
    {
        $today = Carbon::today();

        $products = Producto::with('lifecycleStat')
            ->where('perishable', true)
            ->get();

        $suggestions = $products->map(function (Producto $product) use ($today) {
            $stat = $product->lifecycleStat;
            $shelfLife = $stat?->estimated_shelf_life_days ?? $product->shelf_life_days;
            $lastPurchase = $stat?->last_purchase_date;

            if (!$shelfLife || !$lastPurchase) {
                return null;
            }

            $elapsedDays = $lastPurchase->diffInDays($today);
            $remainingDays = $shelfLife - $elapsedDays;

            $suggestedType = null;
            if ($remainingDays <= 1) {
                $suggestedType = ProductOffer::TYPE_CLEARANCE;
            } elseif ($remainingDays <= 2) {
                $suggestedType = ProductOffer::TYPE_PROMO;
            }

            if (!$suggestedType) {
                return null;
            }

            $stockCurrent = (float) $product->stock_actual;
            if ($stockCurrent <= 0 && $stat) {
                $stockCurrent = max(0, (float) $stat->total_purchased_units - (float) $stat->total_sold_units);
            }

            return [
                'product_id' => $product->id,
                'name' => $product->nombre,
                'current_price' => (float) $product->precio_actual,
                'stock_current' => $stockCurrent,
                'last_purchase_date' => $lastPurchase?->toDateString(),
                'total_purchased_units' => $stat?->total_purchased_units ?? 0,
                'total_sold_units' => $stat?->total_sold_units ?? 0,
                'estimated_shelf_life_days' => $shelfLife,
                'remaining_days' => $remainingDays,
                'suggested_type' => $suggestedType,
            ];
        })->filter();

        return $this->applyFilters($suggestions, $filters)->values();
    }

    private function applyFilters(Collection $suggestions, array $filters): Collection
    {
        if (!empty($filters['suggested_type'])) {
            $suggestions = $suggestions->where('suggested_type', $filters['suggested_type']);
        }

        if (isset($filters['min_remaining_days'])) {
            $suggestions = $suggestions->where('remaining_days', '>=', (int) $filters['min_remaining_days']);
        }

        if (isset($filters['max_remaining_days'])) {
            $suggestions = $suggestions->where('remaining_days', '<=', (int) $filters['max_remaining_days']);
        }

        return $suggestions;
    }
}
