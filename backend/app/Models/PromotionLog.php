<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromotionLog extends Model
{
    use HasFactory;

    public const EVENT_CREATED = 'CREATED';
    public const EVENT_UPDATED = 'UPDATED';
    public const EVENT_ACTIVATED = 'ACTIVATED';
    public const EVENT_DEACTIVATED = 'DEACTIVATED';
    public const EVENT_DELETED = 'DELETED';

    protected $fillable = [
        'promotion_id',
        'event_type',
        'event_at',
        'user_id',
        'payload',
    ];

    protected $casts = [
        'event_at' => 'datetime',
        'payload' => 'array',
    ];

    public function promotion(): BelongsTo
    {
        return $this->belongsTo(Promotion::class);
    }
}
