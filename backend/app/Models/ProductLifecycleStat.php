<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductLifecycleStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'last_purchase_date',
        'last_sale_date',
        'estimated_shelf_life_days',
        'avg_daily_sales',
        'total_purchased_units',
        'total_sold_units',
        'liquidation_count',
        'last_liquidation_at',
    ];

    protected $casts = [
        'last_purchase_date' => 'date',
        'last_sale_date' => 'date',
        'estimated_shelf_life_days' => 'integer',
        'avg_daily_sales' => 'decimal:3',
        'total_purchased_units' => 'decimal:3',
        'total_sold_units' => 'decimal:3',
        'liquidation_count' => 'integer',
        'last_liquidation_at' => 'datetime',
    ];

    public function product()
    {
        return $this->belongsTo(Producto::class, 'product_id');
    }
}
