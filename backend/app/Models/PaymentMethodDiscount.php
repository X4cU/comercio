<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethodDiscount extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_method',
        'max_discount_percentage',
    ];

    protected $casts = [
        'max_discount_percentage' => 'float',
    ];
}
