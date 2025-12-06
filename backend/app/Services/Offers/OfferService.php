<?php

declare(strict_types=1);

namespace App\Services\Offers;

use App\Models\ProductOffer;
use App\Models\ProductOfferEvent;
use App\Models\Producto;
use Illuminate\Database\DatabaseManager;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class OfferService
{
    public function __construct(private readonly DatabaseManager $db)
    {
    }

    public function createOffer(Producto $product, array $data, string $userId): ProductOffer
    {
        $this->guardQuantity($product, (float) $data['affected_quantity']);

        $oldPrice = isset($data['old_price']) ? (float) $data['old_price'] : (float) $product->precio_actual;
        $discount = (float) $data['discount_percentage'];
        $newPrice = $this->calculateNewPrice($oldPrice, $discount);

        return $this->db->transaction(function () use ($product, $data, $userId, $oldPrice, $newPrice) {
            $offer = ProductOffer::create([
                'product_id' => $product->id,
                'type' => $data['type'],
                'status' => ProductOffer::STATUS_ACTIVE,
                'source' => ProductOffer::SOURCE_MANUAL,
                'discount_percentage' => $data['discount_percentage'],
                'affected_quantity' => $data['affected_quantity'],
                'old_price' => $oldPrice,
                'new_price' => $newPrice,
                'valid_from' => $data['valid_from'],
                'valid_until' => $data['valid_until'],
                'notes' => $data['notes'] ?? null,
                'created_by' => $userId,
                'activated_by' => $userId,
            ]);

            $this->recordEvent($offer, ProductOfferEvent::EVENT_CREATED, $userId);
            $this->recordEvent($offer, ProductOfferEvent::EVENT_ACTIVATED, $userId);

            return $offer->fresh(['product', 'events']);
        });
    }

    public function updateOffer(ProductOffer $offer, array $data, string $userId): ProductOffer
    {
        if (isset($data['affected_quantity'])) {
            $this->guardQuantity($offer->product, (float) $data['affected_quantity']);
        }

        $payload = [];

        if (isset($data['discount_percentage'])) {
            $payload['discount_percentage'] = $data['discount_percentage'];
            $offer->new_price = $this->calculateNewPrice((float) $offer->old_price, (float) $data['discount_percentage']);
        }

        $offer->fill($data);

        return $this->db->transaction(function () use ($offer, $userId, $payload) {
            $offer->save();

            if (!empty($payload)) {
                $this->recordEvent($offer, ProductOfferEvent::EVENT_QUANTITY_UPDATED, $userId, $payload);
            }

            return $offer->fresh(['product', 'events']);
        });
    }

    public function cancelOffer(ProductOffer $offer, string $userId): ProductOffer
    {
        return $this->db->transaction(function () use ($offer, $userId) {
            $offer->status = ProductOffer::STATUS_CANCELED;
            $offer->canceled_by = $userId;
            $offer->save();

            $this->recordEvent($offer, ProductOfferEvent::EVENT_CANCELED, $userId);

            return $offer->fresh(['product', 'events']);
        });
    }

    public function getActiveOfferForProduct(int $productId): ?ProductOffer
    {
        $now = Carbon::now();

        return ProductOffer::query()
            ->where('product_id', $productId)
            ->where('status', ProductOffer::STATUS_ACTIVE)
            ->where('valid_from', '<=', $now)
            ->where('valid_until', '>=', $now)
            ->orderByDesc('discount_percentage')
            ->first();
    }

    private function guardQuantity(Producto $product, float $affectedQuantity): void
    {
        $stock = (float) $product->stock_actual;
        if ($stock <= 0 && $product->relationLoaded('lifecycleStat')) {
            $stock = max(0, (float) $product->lifecycleStat?->total_purchased_units - (float) $product->lifecycleStat?->total_sold_units);
        }

        if ($stock > 0 && $affectedQuantity > $stock) {
            throw ValidationException::withMessages([
                'affected_quantity' => 'La cantidad afectada no puede superar el stock actual.',
            ]);
        }
    }

    private function calculateNewPrice(float $oldPrice, float $discount): float
    {
        $discounted = $oldPrice * (1 - ($discount / 100));

        return round($discounted, 2);
    }

    private function recordEvent(ProductOffer $offer, string $type, string $userId, array $payload = []): void
    {
        $offer->events()->create([
            'event_type' => $type,
            'event_at' => Carbon::now(),
            'user_id' => $userId,
            'payload' => $payload,
        ]);
    }
}
