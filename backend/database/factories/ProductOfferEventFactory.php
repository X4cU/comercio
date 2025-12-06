<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ProductOffer;
use App\Models\ProductOfferEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductOfferEvent>
 */
class ProductOfferEventFactory extends Factory
{
    protected $model = ProductOfferEvent::class;

    public function definition(): array
    {
        return [
            'product_offer_id' => ProductOffer::factory(),
            'event_type' => ProductOfferEvent::EVENT_CREATED,
            'event_at' => now(),
            'user_id' => 'factory-user',
            'payload' => [
                'discount' => 10,
            ],
        ];
    }
}
