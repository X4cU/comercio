<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Producto extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',
        'categoria',
        'unidad_venta',
        'tipo',
        'sku',
        'descripcion',
        'imagen',
        'estado',
        'shelf_life_days',
        'perishable',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'estado' => 'boolean',
        'perishable' => 'boolean',
        'shelf_life_days' => 'integer',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'imagen_url',
        'precio_actual',
        'stock_actual',
    ];

    public function lifecycleStat(): HasOne
    {
        return $this->hasOne(ProductLifecycleStat::class, 'product_id');
    }

    public function setImagenAttribute(?string $value): void
    {
        $this->attributes['imagen'] = $value ?: null;
    }

    public function stockTarget(): HasOne
    {
        return $this->hasOne(ProductStockTarget::class, 'product_id');
    }

    public function getImagenUrlAttribute(): ?string
    {
        if (!$this->imagen) {
            return null;
        }

        return Storage::disk('public')->url($this->imagen);
    }

    public function getPrecioActualAttribute(): float
    {
        return (float) ($this->attributes['precio_actual'] ?? 0);
    }

    public function getStockActualAttribute(): float
    {
        return (float) ($this->attributes['stock_actual'] ?? 0);
    }
}
