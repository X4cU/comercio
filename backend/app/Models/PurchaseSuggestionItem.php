<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseSuggestionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_suggestion_id',
        'product_id',
        'current_stock',
        'optimal_stock',
        'min_stock',
        'projected_sales_days',
        'avg_daily_sales',
        'safety_stock',
        'recommended_qty',
        'final_qty',
        'reason_flags',
        'notes',
    ];

    protected $casts = [
        'current_stock' => 'decimal:3',
        'optimal_stock' => 'decimal:3',
        'min_stock' => 'decimal:3',
        'avg_daily_sales' => 'decimal:3',
        'safety_stock' => 'decimal:3',
        'recommended_qty' => 'decimal:3',
        'final_qty' => 'decimal:3',
        'reason_flags' => 'array',
    ];

    public function purchaseSuggestion(): BelongsTo
    {
        return $this->belongsTo(PurchaseSuggestion::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'product_id');
    }
}
