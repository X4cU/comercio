<?php

declare(strict_types=1);

namespace App\Services\Pos;

use App\Models\AuditLog;
use App\Models\CashSession;
use App\Models\Payment;
use App\Models\PaymentMethodDiscount;
use App\Models\Producto;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Carbon;
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

        $items = collect($data['items']);
        $stockSnapshots = $this->stockService->reserveStockForSale($items);
        $computed = $this->calculateTotals($items, $data['payment_method'], (bool) ($data['apply_discount'] ?? false), $stockSnapshots);

        $paymentAmount = $computed['total'];
        if ($paymentAmount <= 0) {
            throw new BadRequestHttpException('El total de la venta debe ser mayor a cero.');
        }

        return $this->databaseManager->transaction(function () use (
            $cashSession,
            $data,
            $userId,
            $computed,
            $stockSnapshots,
        ): Sale {
            $sale = Sale::create([
                'cash_session_id' => $cashSession->id,
                'user_id' => $userId,
                'sale_number' => $this->generateSaleNumber(),
                'mode' => 'INTERNAL',
                'payment_method' => $data['payment_method'],
                'subtotal' => $computed['subtotal'],
                'discount_total' => $computed['discount_total'],
                'applied_discount_percentage' => $computed['applied_discount_percentage'],
                'tax_total' => 0,
                'total' => $computed['total'],
                'status' => Sale::STATUS_COMPLETED,
                'printed_at' => Carbon::now(),
                'low_stock_flag' => false,
            ]);

            $this->createItems($sale, $computed['items']);
            $this->createPayment($sale, $computed['total'], $data['payment_method']);

            $this->stockService->applySaleStockMovements($sale, $items, $stockSnapshots);

            $this->logAudit($userId, sprintf('Venta %s confirmada en POS', $sale->sale_number));

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

    private function calculateTotals(Collection $items, string $paymentMethod, bool $applyDiscount, array $stockSnapshots): array
    {
        $paymentDiscount = PaymentMethodDiscount::where('payment_method', $paymentMethod)->first();
        $discountPercent = $applyDiscount ? (float) ($paymentDiscount?->max_discount_percentage ?? 0) : 0;

        $mappedItems = $items->values()->map(function (array $item, int $index) use ($stockSnapshots): array {
            $product = Producto::find($item['product_id']);
            if (!$product) {
                throw new NotFoundHttpException('Producto no encontrado');
            }

            $unitPrice = isset($item['unit_price']) ? (float) $item['unit_price'] : (float) ($product->current_sale_price ?? $product->precio_actual ?? 0);
            $lineSubtotal = $unitPrice * (float) $item['quantity'];

            return [
                'product_id' => $item['product_id'],
                'product_name_snapshot' => $product->nombre,
                'unit_price' => $unitPrice,
                'quantity' => (float) $item['quantity'],
                'discount_amount' => 0,
                'line_subtotal' => $lineSubtotal,
                'total' => $lineSubtotal,
                'insufficient_stock' => (bool) ($stockSnapshots[$index]['insufficient'] ?? false),
            ];
        });

        $subtotal = $mappedItems->sum('line_subtotal');
        $discountTotal = $discountPercent > 0 ? ($subtotal * $discountPercent) / 100 : 0;
        $total = $subtotal - $discountTotal;

        return [
            'items' => $mappedItems->map(function (array $item) use ($subtotal, $discountTotal): array {
                $proportional = $subtotal > 0 ? ($item['line_subtotal'] / $subtotal) * $discountTotal : 0;
                return [
                    'product_id' => $item['product_id'],
                    'product_name_snapshot' => $item['product_name_snapshot'],
                    'unit_price' => $item['unit_price'],
                    'quantity' => $item['quantity'],
                    'discount_amount' => round($proportional, 2),
                    'total' => round($item['line_subtotal'] - $proportional, 2),
                    'insufficient_stock' => $item['insufficient_stock'] ?? false,
                ];
            }),
            'subtotal' => round($subtotal, 2),
            'discount_total' => round($discountTotal, 2),
            'applied_discount_percentage' => round($discountPercent, 2),
            'total' => round($total, 2),
        ];
    }

    private function createItems(Sale $sale, Collection $items): void
    {
        $items->each(fn (array $item) => SaleItem::create($item + ['sale_id' => $sale->id]));
    }

    private function createPayment(Sale $sale, float $total, string $paymentMethod): void
    {
        Payment::create([
            'sale_id' => $sale->id,
            'payment_method' => $paymentMethod,
            'amount' => $total,
        ]);
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
