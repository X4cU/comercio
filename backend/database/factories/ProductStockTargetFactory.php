<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ProductStockTarget;
use App\Models\Producto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductStockTarget>
 */
class ProductStockTargetFactory extends Factory
{
    protected $model = ProductStockTarget::class;

    public function definition(): array
    {
        return [
            'product_id' => Producto::factory(),
            'min_stock' => 5,
            'optimal_stock' => 10,
            'max_stock' => 20,
            'lead_time_days' => 2,
            'priority' => 1,
        ];
    }
}
