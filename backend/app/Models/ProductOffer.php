<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductOffer extends Model
{
    use HasFactory;
    use SoftDeletes;

    public const TYPE_PROMO = 'PROMO';
    public const TYPE_CLEARANCE = 'CLEARANCE';

    public const STATUS_PLANNED = 'PLANNED';
    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_EXPIRED = 'EXPIRED';
    public const STATUS_CANCELED = 'CANCELED';

    public const SOURCE_AUTO = 'AUTO_SUGGESTED';
    public const SOURCE_MANUAL = 'MANUAL';

    protected $fillable = [
        'product_id',
        'type',
        'status',
        'source',
        'discount_percentage',
        'affected_quantity',
        'old_price',
        'new_price',
        'valid_from',
        'valid_until',
        'notes',
        'created_by',
        'activated_by',
        'canceled_by',
    ];

    protected $casts = [
        'discount_percentage' => 'decimal:2',
        'affected_quantity' => 'decimal:3',
        'old_price' => 'decimal:2',
        'new_price' => 'decimal:2',
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
    ];

    public function product()
    {
        return $this->belongsTo(Producto::class, 'product_id');
    }

    public function events()
    {
        return $this->hasMany(ProductOfferEvent::class, 'product_offer_id');
    }
}
