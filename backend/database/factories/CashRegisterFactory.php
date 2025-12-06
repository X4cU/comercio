<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\CashRegister;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CashRegister>
 */
class CashRegisterFactory extends Factory
{
    protected $model = CashRegister::class;

    public function definition(): array
    {
        return [
            'name' => 'Caja ' . $this->faker->unique()->numberBetween(1, 50),
            'location' => $this->faker->randomElement(['Verdulería', 'Despensa', 'General']),
            'is_active' => true,
        ];
    }
}
