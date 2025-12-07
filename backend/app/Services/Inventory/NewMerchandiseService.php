<?php

declare(strict_types=1);

namespace App\Services\Inventory;

use App\Models\InventoryMovement;
use App\Models\ProductBatch;
use App\Models\Producto;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class NewMerchandiseService
{
    public function __construct(private PricingRuleResolver $pricingRuleResolver)
    {
    }

    public function createBatch(array $data, string $userId): ProductBatch
    {
        /** @var Producto $product */
        $product = Producto::query()->findOrFail($data['product_id']);

        $rules = $this->pricingRuleResolver->resolveForProduct($product);

        $shrinkage = array_key_exists('initial_shrinkage_rate', $data) && $data['initial_shrinkage_rate'] !== null
            ? (float) $data['initial_shrinkage_rate']
            : $rules['shrinkage'];
        $margin = array_key_exists('margin_rate', $data) && $data['margin_rate'] !== null
            ? (float) $data['margin_rate']
            : $rules['margin'];

        $arrivalDate = Carbon::parse($data['arrival_date']);
        $expirationDate = $data['expiration_date'] ? Carbon::parse($data['expiration_date']) : null;

        if (!$expirationDate && $product->section === 'PRODUCE' && $product->shelf_life_days) {
            $expirationDate = $arrivalDate->clone()->addDays((int) $product->shelf_life_days);
        }

        $grossCost = (float) $data['gross_cost_per_bulk'];
        $bulkUnits = (float) $data['bulk_units'];
        $shrinkageFactor = max(0.0, 1 - ($shrinkage / 100));
        $basePrice = $bulkUnits > 0 ? $grossCost / ($bulkUnits * $shrinkageFactor) : 0.0;
        $finalPrice = $basePrice * (1 + ($margin / 100));

        $quantityReceived = $bulkUnits * $shrinkageFactor;

        return DB::transaction(function () use ($product, $data, $userId, $shrinkage, $margin, $arrivalDate, $expirationDate, $grossCost, $bulkUnits, $basePrice, $finalPrice, $quantityReceived) {
            $batch = ProductBatch::query()->create([
                'product_id' => $product->id,
                'batch_code' => $data['batch_code'] ?? null,
                'arrival_date' => $arrivalDate,
                'expiration_date' => $expirationDate,
                'quantity_received' => $quantityReceived,
                'quantity_remaining' => $quantityReceived,
                'gross_cost_per_bulk' => $grossCost,
                'bulk_units' => $bulkUnits,
                'initial_shrinkage_rate' => $shrinkage,
                'margin_rate' => $margin,
                'base_price' => $basePrice,
                'final_price' => $finalPrice,
                'section' => $product->section,
                'notes' => $data['notes'] ?? null,
                'created_by' => $userId,
            ]);

            InventoryMovement::query()->create([
                'product_id' => $product->id,
                'product_batch_id' => $batch->id,
                'movement_type' => 'IN',
                'quantity' => $quantityReceived,
                'movement_date' => Carbon::now(),
                'reason' => 'NEW_MERCHANDISE',
                'reference_id' => null,
                'created_by' => $userId,
            ]);

            $product->current_sale_price = $finalPrice;
            $product->save();

            return $batch;
        });
    }
}
