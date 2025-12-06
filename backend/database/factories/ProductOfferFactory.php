<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ProductOffer;
use App\Models\Producto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductOffer>
 */
class ProductOfferFactory extends Factory
{
    protected $model = ProductOffer::class;

    public function definition(): array
    {
        $oldPrice = $this->faker->randomFloat(2, 10, 100);
        $discount = $this->faker->randomFloat(2, 5, 30);

        return [
            'product_id' => Producto::factory(),
            'type' => ProductOffer::TYPE_PROMO,
            'status' => ProductOffer::STATUS_ACTIVE,
            'source' => ProductOffer::SOURCE_MANUAL,
            'discount_percentage' => $discount,
            'affected_quantity' => $this->faker->randomFloat(3, 1, 20),
            'old_price' => $oldPrice,
            'new_price' => $oldPrice * (1 - ($discount / 100)),
            'valid_from' => now()->subHour(),
            'valid_until' => now()->addDay(),
            'notes' => 'Oferta generada para pruebas automáticas',
            'created_by' => 'factory-user',
            'activated_by' => 'factory-user',
        ];
    }
}
