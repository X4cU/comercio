<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductPricingRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'scope_type',
        'scope_id',
        'default_margin_rate',
        'default_shrinkage_rate',
        'enabled',
        'created_by',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'default_margin_rate' => 'float',
        'default_shrinkage_rate' => 'float',
    ];
}
