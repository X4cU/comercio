<?php

declare(strict_types=1);

namespace App\Services\Pos;

use App\Models\Sale;

class ArcaServiceStub
{
    /**
     * Preparará el payload para ARCA en futuras iteraciones.
     * Actualmente solo documenta el formato esperado.
     */
    public function prepareInvoicePayload(Sale $sale): array
    {
        return [
            'sale_number' => $sale->sale_number,
            'mode' => $sale->mode,
            'items' => $sale->items->map(fn ($item) => [
                'product_id' => $item->product_id,
                'description' => $item->product_name_snapshot,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'total' => $item->total,
            ])->toArray(),
            'totals' => [
                'subtotal' => $sale->subtotal,
                'discounts' => $sale->discount_total,
                'taxes' => $sale->tax_total,
                'total' => $sale->total,
            ],
        ];
    }

    /**
     * Marca la venta como lista para integración futura con ARCA.
     */
    public function markAsReadyForArca(Sale $sale): void
    {
        // Punto de extensión futura: aquí se notificará a ARCA.
        $sale->update(['printed_at' => now()]);
    }
}
