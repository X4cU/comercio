<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductBatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'batch_code',
        'arrival_date',
        'expiration_date',
        'quantity_received',
        'quantity_remaining',
        'gross_cost_per_bulk',
        'bulk_units',
        'initial_shrinkage_rate',
        'margin_rate',
        'base_price',
        'final_price',
        'section',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'arrival_date' => 'date',
        'expiration_date' => 'date',
        'quantity_received' => 'float',
        'quantity_remaining' => 'float',
        'gross_cost_per_bulk' => 'float',
        'bulk_units' => 'float',
        'initial_shrinkage_rate' => 'float',
        'margin_rate' => 'float',
        'base_price' => 'float',
        'final_price' => 'float',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'product_id');
    }
}
