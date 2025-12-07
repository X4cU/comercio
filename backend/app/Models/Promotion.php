<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
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
    public const DISCOUNT_FIXED_PRICE = 'FIXED_PRICE';

    protected $fillable = [
        'name',
        'description',
        'scope_type',
        'scope_id',
        'discount_type',
        'discount_value',
        'promotional_price',
        'min_quantity',
        'valid_from',
        'valid_until',
        'is_active',
        'priority',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'promotional_price' => 'decimal:2',
        'min_quantity' => 'decimal:3',
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

    protected function nombre(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->name,
            set: fn ($value): array => ['name' => $value],
        );
    }

    protected function descripcion(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->description,
            set: fn ($value): array => ['description' => $value],
        );
    }

    protected function tipo(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->discount_type,
            set: fn ($value): array => ['discount_type' => $value],
        );
    }

    protected function valorDescuento(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->discount_value,
            set: fn ($value): array => ['discount_value' => $value],
        );
    }

    protected function precioPromocional(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->promotional_price,
            set: fn ($value): array => ['promotional_price' => $value],
        );
    }

    protected function fechaInicio(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->valid_from,
            set: fn ($value): array => ['valid_from' => $value],
        );
    }

    protected function fechaFin(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->valid_until,
            set: fn ($value): array => ['valid_until' => $value],
        );
    }

    protected function activo(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->is_active,
            set: fn ($value): array => ['is_active' => $value],
        );
    }
}
