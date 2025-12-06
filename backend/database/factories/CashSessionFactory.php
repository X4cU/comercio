<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\CashRegister;
use App\Models\CashSession;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<CashSession>
 */
class CashSessionFactory extends Factory
{
    protected $model = CashSession::class;

    public function definition(): array
    {
        return [
            'cash_register_id' => CashRegister::factory(),
            'user_id' => $this->faker->uuid(),
            'opened_at' => Carbon::now(),
            'opening_amount' => 0,
            'status' => 'OPEN',
            'notes' => null,
        ];
    }
}
