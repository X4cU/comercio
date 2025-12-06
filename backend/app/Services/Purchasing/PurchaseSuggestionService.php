<?php

declare(strict_types=1);

namespace App\Services\Purchasing;

use App\Models\ProductLifecycleStat;
use App\Models\Producto;
use App\Models\PurchaseSuggestion;
use App\Models\PurchaseSuggestionItem;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class PurchaseSuggestionService
{
    private const LIQUIDATION_DAMPING_FACTOR = 0.5;
    private const RECENT_LIQUIDATION_DAYS = 14;

    public function generateForDate(Carbon $referenceDate, int $projectedSalesDays, string $createdBy): PurchaseSuggestion
    {
        $suggestion = PurchaseSuggestion::firstOrNew([
            'reference_date' => $referenceDate->toDateString(),
            'status' => PurchaseSuggestion::STATUS_DRAFT,
        ]);

        $suggestion->fill([
            'created_by' => $createdBy,
        ]);
        $suggestion->save();

        $suggestion->items()->delete();

        $products = $this->candidateProducts();

        $items = $products->map(function (Producto $product) use ($projectedSalesDays, $suggestion): ?PurchaseSuggestionItem {
            $target = $product->stockTarget;
            if (!$target) {
                return null;
            }

            $lifecycle = $product->lifecycleStat;
            $currentStock = $this->resolveCurrentStock($product, $lifecycle);
            $avgDailySales = $this->resolveAvgDailySales($lifecycle);
            $safetyStock = $this->calculateSafetyStock($avgDailySales);
            $projectedNeed = $avgDailySales * $projectedSalesDays;

            $targetStock = max((float) $target->optimal_stock, $projectedNeed + $safetyStock);
            $neededQty = $targetStock - $currentStock;

            $reasonFlags = [];
            if ($currentStock < $target->min_stock) {
                $reasonFlags[] = 'BELOW_MIN';
            }
            if ($currentStock < $target->optimal_stock) {
                $reasonFlags[] = 'LOW_STOCK';
            }
            if ($avgDailySales > 0) {
                $reasonFlags[] = 'HIGH_ROTATION';
            }

            $neededQty = $this->applyLifecycleAdjustments($neededQty, $lifecycle, $reasonFlags);

            if ($neededQty <= 0) {
                return null;
            }

            return $suggestion->items()->create([
                'product_id' => $product->id,
                'current_stock' => $currentStock,
                'optimal_stock' => $target->optimal_stock,
                'min_stock' => $target->min_stock,
                'projected_sales_days' => $projectedSalesDays,
                'avg_daily_sales' => $avgDailySales,
                'safety_stock' => $safetyStock,
                'recommended_qty' => $neededQty,
                'final_qty' => $neededQty,
                'reason_flags' => $reasonFlags,
            ]);
        })->filter();

        $suggestion->setRelation('items', $items);

        return $suggestion;
    }

    private function candidateProducts(): Collection
    {
        return Producto::query()
            ->where('estado', true)
            ->whereHas('stockTarget')
            ->with(['stockTarget', 'lifecycleStat'])
            ->get();
    }

    private function resolveCurrentStock(Producto $product, ?ProductLifecycleStat $lifecycle): float
    {
        $currentStock = (float) ($product->stock_actual ?? 0);

        if ($currentStock <= 0 && $lifecycle) {
            $currentStock = (float) (($lifecycle->total_purchased_units ?? 0) - ($lifecycle->total_sold_units ?? 0));
        }

        return max($currentStock, 0);
    }

    private function resolveAvgDailySales(?ProductLifecycleStat $lifecycle): float
    {
        if (!$lifecycle) {
            return 0.0;
        }

        return (float) ($lifecycle->avg_daily_sales ?? 0);
    }

    private function calculateSafetyStock(float $avgDailySales): float
    {
        // Simple buffer: one extra day of sales as safety stock. Tunable in future iterations.
        return $avgDailySales;
    }

    private function applyLifecycleAdjustments(float $neededQty, ?ProductLifecycleStat $lifecycle, array &$reasonFlags): float
    {
        if (!$lifecycle) {
            return $neededQty;
        }

        if (($lifecycle->liquidation_count ?? 0) >= 3) {
            $neededQty *= self::LIQUIDATION_DAMPING_FACTOR;
            $reasonFlags[] = 'RECENT_LIQUIDATIONS';
        }

        if ($lifecycle->last_liquidation_at && $lifecycle->last_liquidation_at->gt(now()->subDays(self::RECENT_LIQUIDATION_DAYS))) {
            $neededQty *= self::LIQUIDATION_DAMPING_FACTOR;
            $reasonFlags[] = 'RECENT_LIQUIDATIONS';
        }

        return $neededQty;
    }
}
