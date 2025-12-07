<?php

declare(strict_types=1);

namespace App\Services\Pos;

use App\Models\PosSetting;
use App\Models\PaymentMethodDiscount;

class PosConfigService
{
    private const DEFAULT_PAYMENT_METHODS = [
        'CASH',
        'DEBIT_CARD',
        'CREDIT_CARD',
        'TRANSFER',
        'OTHER',
    ];

    private const DEFAULT_DISCOUNT_LIMITS = [
        'cajero' => 0.10,
        'admin' => 0.30,
        'superadmin' => 1.0,
    ];

    public function getConfig(): array
    {
        return [
            'payment_methods' => $this->getPaymentMethods(),
            'payment_discounts' => $this->getPaymentDiscounts(),
            'discount_limits' => $this->getDiscountLimits(),
            'ticket' => $this->getTicketConfig(),
            'arca' => [
                'status' => 'DISABLED',
                'description' => 'Integración pendiente. Venta marcada para futura facturación.',
            ],
        ];
    }

    private function getPaymentMethods(): array
    {
        $setting = PosSetting::where('key', 'payment_methods')->first();

        return $setting?->value ?? self::DEFAULT_PAYMENT_METHODS;
    }

    private function getPaymentDiscounts(): array
    {
        return PaymentMethodDiscount::query()
            ->get(['payment_method', 'max_discount_percentage'])
            ->mapWithKeys(fn (PaymentMethodDiscount $discount) => [
                $discount->payment_method => (float) $discount->max_discount_percentage,
            ])
            ->toArray();
    }

    private function getDiscountLimits(): array
    {
        $setting = PosSetting::where('key', 'discount_limits')->first();

        return $setting?->value ?? self::DEFAULT_DISCOUNT_LIMITS;
    }

    private function getTicketConfig(): array
    {
        $setting = PosSetting::where('key', 'ticket_config')->first();
        $defaults = [
            'prefix' => 'POS-',
            'legal_legend' => 'Comprobante NO fiscal – No válido como factura',
            'store_name' => 'Comercio',
        ];

        return array_merge($defaults, $setting?->value ?? []);
    }
}
