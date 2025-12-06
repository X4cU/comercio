<?php

declare(strict_types=1);

namespace App\Services\Pos;

use App\Models\Sale;
use Illuminate\Support\Collection;
use RuntimeException;

class StockService
{
    /**
     * Reservar stock para una venta.
     * En una integración real, se validarían existencias por producto.
     */
    public function reserveStockForSale(Collection $items): void
    {
        $items->each(function (array $item): void {
            if ($item['quantity'] <= 0) {
                throw new RuntimeException('Quantity must be greater than zero');
            }
        });
    }

    /**
     * Revertir stock cuando se cancela la venta.
     */
    public function revertStockForSale(Sale $sale): void
    {
        // Punto de integración futura: restablecer inventario.
    }
}
