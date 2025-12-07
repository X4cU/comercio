<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\PaymentMethodDiscount;
use Illuminate\Database\Seeder;

class PaymentMethodDiscountSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            ['payment_method' => 'efectivo', 'max_discount_percentage' => 10],
            ['payment_method' => 'transferencia', 'max_discount_percentage' => 5],
            ['payment_method' => 'debito', 'max_discount_percentage' => 0],
            ['payment_method' => 'credito', 'max_discount_percentage' => 0],
            ['payment_method' => 'mp', 'max_discount_percentage' => 0],
        ];

        foreach ($defaults as $config) {
            PaymentMethodDiscount::updateOrCreate(
                ['payment_method' => $config['payment_method']],
                ['max_discount_percentage' => $config['max_discount_percentage']]
            );
        }
    }
}
