<?php

declare(strict_types=1);

namespace App\Services\Pos;

use App\Models\InventoryMovement;
use App\Models\ProductLifecycleStat;
use App\Models\Producto;
use App\Models\Sale;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use RuntimeException;

class StockService
{
    /**
     * Verifica cantidades y permite stock negativo.
     */
    public function reserveStockForSale(Collection $items): array
    {
        return $items->map(function (array $item): array {
            if ($item['quantity'] <= 0) {
                throw new RuntimeException('Quantity must be greater than zero');
            }

            $product = Producto::find($item['product_id']);
            if (!$product) {
                throw new RuntimeException('Producto no encontrado');
            }

            $currentStock = (float) ($product->stock_actual ?? 0);
            if ($currentStock <= 0) {
                $stat = $product->lifecycleStat;
                if ($stat) {
                    $currentStock = (float) $stat->total_purchased_units - (float) $stat->total_sold_units;
                }
            }

            $insufficient = $currentStock < (float) $item['quantity'];

            return [
                'product' => $product,
                'current_stock' => $currentStock,
                'insufficient' => $insufficient,
            ];
        })->toArray();
    }

    public function applySaleStockMovements(Sale $sale, Collection $items, array $stockSnapshots): void
    {
        $items->each(function (array $item, int $index) use ($sale, $stockSnapshots): void {
            $product = $stockSnapshots[$index]['product'];
            $insufficient = $stockSnapshots[$index]['insufficient'];
            $quantity = (float) $item['quantity'];

            $stat = ProductLifecycleStat::firstOrCreate(['product_id' => $product->id]);
            $stat->increment('total_sold_units', $quantity);
            $stat->last_sale_date = Carbon::now();
            $stat->save();

            InventoryMovement::create([
                'product_id' => $product->id,
                'movement_type' => 'OUT',
                'quantity' => $quantity,
                'movement_date' => Carbon::now(),
                'reason' => 'POS_SALE',
                'reference_id' => $sale->id,
                'created_by' => $sale->user_id,
            ]);

            $product->stock_actual = (float) ($product->stock_actual ?? 0) - $quantity;
            $product->save();

            if ($insufficient) {
                $sale->low_stock_flag = true;
                $sale->save();
            }
        });
    }

    /**
     * Placeholder para futuras reversiones completas de inventario.
     */
    public function revertStockForSale(Sale $sale): void
    {
        // Este proyecto permite stock negativo; la reversión se implementará cuando se definan reglas de devoluciones.
    }
}
