<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\PurchaseSuggestion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PurchaseSuggestion>
 */
class PurchaseSuggestionFactory extends Factory
{
    protected $model = PurchaseSuggestion::class;

    public function definition(): array
    {
        return [
            'reference_date' => now(),
            'status' => PurchaseSuggestion::STATUS_DRAFT,
            'created_by' => 'system',
        ];
    }
}
