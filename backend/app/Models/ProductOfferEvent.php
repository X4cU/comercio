<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductOfferEvent extends Model
{
    use HasFactory;

    public const EVENT_CREATED = 'CREATED';
    public const EVENT_ACTIVATED = 'ACTIVATED';
    public const EVENT_EXPIRED = 'EXPIRED';
    public const EVENT_CANCELED = 'CANCELED';
    public const EVENT_QUANTITY_UPDATED = 'QUANTITY_UPDATED';

    protected $fillable = [
        'product_offer_id',
        'event_type',
        'event_at',
        'user_id',
        'payload',
    ];

    protected $casts = [
        'event_at' => 'datetime',
        'payload' => 'array',
    ];

    public function offer()
    {
        return $this->belongsTo(ProductOffer::class, 'product_offer_id');
    }
}
