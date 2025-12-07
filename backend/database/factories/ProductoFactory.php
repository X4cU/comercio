<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Producto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Producto>
 */
class ProductoFactory extends Factory
{
    protected $model = Producto::class;

    public function definition(): array
    {
        return [
            'nombre' => $this->faker->words(3, true),
            'categoria' => $this->faker->word(),
            'unidad_venta' => $this->faker->randomElement(['unidad', 'kg', 'pack']),
            'tipo' => $this->faker->word(),
            'sku' => strtoupper($this->faker->bothify('SKU-###')),
            'descripcion' => $this->faker->sentence(),
            'estado' => true,
            'shelf_life_days' => $this->faker->numberBetween(2, 7),
            'perishable' => true,
            'section' => $this->faker->randomElement(['GROCERY', 'PRODUCE', 'DELI']),
            'current_sale_price' => null,
        ];
    }
}
