<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductStockTarget extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'min_stock',
        'optimal_stock',
        'max_stock',
        'lead_time_days',
        'priority',
    ];

    protected $casts = [
        'min_stock' => 'decimal:3',
        'optimal_stock' => 'decimal:3',
        'max_stock' => 'decimal:3',
        'lead_time_days' => 'integer',
        'priority' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'product_id');
    }
}
