<?php

declare(strict_types=1);

namespace App\Services\Pos;

use App\Models\AuditLog;
use App\Models\CashSession;
use App\Models\Payment;
use App\Models\Producto;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class SaleService
{
    public function __construct(
        private readonly DatabaseManager $databaseManager,
        private readonly PosConfigService $posConfigService,
        private readonly StockService $stockService,
        private readonly ArcaServiceStub $arcaServiceStub,
    ) {
    }

    public function createSale(array $data, string $userId, array $roles): Sale
    {
        $cashSession = CashSession::find($data['cash_session_id']);

        if (!$cashSession || $cashSession->closed_at !== null) {
            throw new BadRequestHttpException('La sesión de caja no está disponible para ventas.');
        }

        $isAdmin = in_array('admin', $roles, true) || in_array('superadmin', $roles, true);
        if ($cashSession->user_id !== $userId && !$isAdmin) {
            throw new BadRequestHttpException('No tienes permiso para operar sobre esta caja.');
        }

        $discountPercent = (float) ($data['global_discount_percent'] ?? 0);
        $this->validateDiscountLimit($discountPercent, $roles);

        $items = collect($data['items']);
        $this->stockService->reserveStockForSale($items);

        $computed = $this->calculateTotals($items, $discountPercent);
        $payments = collect($data['payments']);
        $this->assertPaymentCoverage($payments, $computed['total']);

        return $this->databaseManager->transaction(function () use (
            $cashSession,
            $data,
            $userId,
            $computed,
            $payments,
        ): Sale {
            $sale = Sale::create([
                'cash_session_id' => $cashSession->id,
                'user_id' => $userId,
                'sale_number' => $this->generateSaleNumber(),
                'mode' => $data['mode'],
                'subtotal' => $computed['subtotal'],
                'discount_total' => $computed['discount_total'],
                'tax_total' => $computed['tax_total'],
                'total' => $computed['total'],
                'status' => Sale::STATUS_COMPLETED,
            ]);

            $this->createItems($sale, $computed['items']);
            $this->createPayments($sale, $payments);

            if ($sale->mode === Sale::MODE_ARCA_STUB) {
                $this->arcaServiceStub->markAsReadyForArca($sale->load(['items', 'payments']));
            }

            return $sale->load(['items', 'payments', 'cashSession.cashRegister']);
        });
    }

    public function cancelSale(int $saleId, string $userId): Sale
    {
        $sale = Sale::with(['items', 'cashSession'])->find($saleId);

        if (!$sale) {
            throw new NotFoundHttpException('Venta no encontrada');
        }

        if ($sale->status === Sale::STATUS_CANCELED) {
            throw new BadRequestHttpException('La venta ya fue anulada.');
        }

        return $this->databaseManager->transaction(function () use ($sale, $userId): Sale {
            $sale->update(['status' => Sale::STATUS_CANCELED]);
            $this->stockService->revertStockForSale($sale);
            $this->logAudit($userId, sprintf('Venta %s anulada', $sale->sale_number));

            return $sale;
        });
    }

    private function validateDiscountLimit(float $discountPercent, array $roles): void
    {
        $limits = $this->posConfigService->getConfig()['discount_limits'];
        $allowed = 0.0;

        foreach ($roles as $role) {
            if (isset($limits[$role])) {
                $allowed = max($allowed, (float) $limits[$role] * 100);
            }
        }

        if ($discountPercent > $allowed) {
            throw new BadRequestHttpException('El descuento supera el máximo permitido para tu rol.');
        }
    }

    private function calculateTotals(Collection $items, float $discountPercent): array
    {
        $mappedItems = $items->map(function (array $item): array {
            $product = Producto::find($item['product_id']);
            if (!$product) {
                throw new NotFoundHttpException('Producto no encontrado');
            }

            $lineSubtotal = (float) $item['unit_price'] * (float) $item['quantity'];
            $lineDiscount = (float) ($item['discount_amount'] ?? 0);
            $lineTotal = $lineSubtotal - $lineDiscount;

            return [
                'product_id' => $item['product_id'],
                'product_name_snapshot' => $product->nombre,
                'unit_price' => $item['unit_price'],
                'quantity' => $item['quantity'],
                'discount_amount' => $lineDiscount,
                'line_subtotal' => $lineSubtotal,
                'total' => $lineTotal,
            ];
        });

        $subtotal = $mappedItems->sum('line_subtotal');
        $discountByItem = $mappedItems->sum('discount_amount');
        $globalDiscount = (($subtotal - $discountByItem) * $discountPercent) / 100;
        $taxTotal = 0.0; // Placeholder para impuestos futuros.
        $discountTotal = $discountByItem + $globalDiscount;
        $total = $subtotal - $discountTotal + $taxTotal;

        return [
            'items' => $mappedItems->map(function (array $item) use ($discountPercent, $globalDiscount, $subtotal, $discountByItem) {
                $proportionalGlobalDiscount = $subtotal > 0
                    ? (($item['line_subtotal'] - $item['discount_amount']) / max($subtotal - $discountByItem, 0.01)) * $globalDiscount
                    : 0;

                return [
                    'product_id' => $item['product_id'],
                    'product_name_snapshot' => $item['product_name_snapshot'],
                    'unit_price' => $item['unit_price'],
                    'quantity' => $item['quantity'],
                    'discount_amount' => round($item['discount_amount'] + $proportionalGlobalDiscount, 2),
                    'total' => round($item['total'] - $proportionalGlobalDiscount, 2),
                ];
            }),
            'subtotal' => round($subtotal, 2),
            'discount_total' => round($discountTotal, 2),
            'tax_total' => round($taxTotal, 2),
            'total' => round($total, 2),
        ];
    }

    private function assertPaymentCoverage(Collection $payments, float $total): void
    {
        $paymentsTotal = round($payments->sum('amount'), 2);
        if (abs($paymentsTotal - round($total, 2)) > 0.01) {
            throw new BadRequestHttpException('Los pagos no coinciden con el total de la venta.');
        }
    }

    private function createItems(Sale $sale, Collection $items): void
    {
        $items->each(fn (array $item) => SaleItem::create($item + ['sale_id' => $sale->id]));
    }

    private function createPayments(Sale $sale, Collection $payments): void
    {
        $payments->each(fn (array $payment) => Payment::create($payment + ['sale_id' => $sale->id]));
    }

    private function generateSaleNumber(): string
    {
        $config = $this->posConfigService->getConfig();
        $prefix = $config['ticket']['prefix'] ?? 'POS-';

        return sprintf('%s%s-%s', $prefix, now()->format('YmdHis'), Str::upper(Str::random(4)));
    }

    private function logAudit(string $userId, string $action): void
    {
        AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'created_at' => now(),
        ]);
    }
}
