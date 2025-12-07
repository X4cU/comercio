<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Promotion;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Promotion>
 */
class PromotionFactory extends Factory
{
    protected $model = Promotion::class;

    public function definition(): array
    {
        $validFrom = now()->subDay();

        return [
            'name' => 'Promo ' . Str::random(5),
            'description' => $this->faker->sentence(),
            'scope_type' => Promotion::SCOPE_GLOBAL,
            'scope_id' => null,
            'discount_type' => Promotion::DISCOUNT_PERCENTAGE,
            'discount_value' => $this->faker->numberBetween(5, 30),
            'min_quantity' => null,
            'valid_from' => $validFrom,
            'valid_until' => now()->addDays(5),
            'is_active' => true,
            'priority' => 1,
            'created_by' => 'factory',
        ];
    }

    public function productScope(int $productId): self
    {
        return $this->state(fn () => [
            'scope_type' => Promotion::SCOPE_PRODUCT,
            'scope_id' => $productId,
        ]);
    }

    public function categoryScope(int $categoryId): self
    {
        return $this->state(fn () => [
            'scope_type' => Promotion::SCOPE_CATEGORY,
            'scope_id' => $categoryId,
        ]);
    }
}
