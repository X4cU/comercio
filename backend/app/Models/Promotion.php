<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Promotion extends Model
{
    use HasFactory;
    use SoftDeletes;

    public const SCOPE_GLOBAL = 'GLOBAL';
    public const SCOPE_CATEGORY = 'CATEGORY';
    public const SCOPE_PRODUCT = 'PRODUCT';

    public const DISCOUNT_PERCENTAGE = 'PERCENTAGE';

    protected $fillable = [
        'name',
        'description',
        'scope_type',
        'scope_id',
        'discount_type',
        'discount_value',
        'min_quantity',
        'valid_from',
        'valid_until',
        'is_active',
        'priority',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'discount_value' => 'float',
        'min_quantity' => 'float',
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'is_active' => 'boolean',
        'priority' => 'integer',
    ];

    public function logs(): HasMany
    {
        return $this->hasMany(PromotionLog::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'scope_id');
    }
}
