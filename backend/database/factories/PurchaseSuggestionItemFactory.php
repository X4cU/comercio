<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\PurchaseSuggestion;
use App\Models\PurchaseSuggestionItem;
use App\Models\Producto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PurchaseSuggestionItem>
 */
class PurchaseSuggestionItemFactory extends Factory
{
    protected $model = PurchaseSuggestionItem::class;

    public function definition(): array
    {
        return [
            'purchase_suggestion_id' => PurchaseSuggestion::factory(),
            'product_id' => Producto::factory(),
            'current_stock' => 2,
            'optimal_stock' => 10,
            'min_stock' => 3,
            'projected_sales_days' => 3,
            'avg_daily_sales' => 2,
            'safety_stock' => 2,
            'recommended_qty' => 8,
            'final_qty' => 8,
            'reason_flags' => ['LOW_STOCK'],
        ];
    }
}
