<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ProductLifecycleStat;
use App\Models\Producto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductLifecycleStat>
 */
class ProductLifecycleStatFactory extends Factory
{
    protected $model = ProductLifecycleStat::class;

    public function definition(): array
    {
        return [
            'product_id' => Producto::factory(),
            'last_purchase_date' => now()->subDays(3),
            'last_sale_date' => now()->subDay(),
            'estimated_shelf_life_days' => 5,
            'avg_daily_sales' => 3.5,
            'total_purchased_units' => 50,
            'total_sold_units' => 30,
        ];
    }
}
