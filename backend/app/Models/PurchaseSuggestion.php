<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseSuggestion extends Model
{
    use HasFactory;

    public const STATUS_DRAFT = 'DRAFT';
    public const STATUS_CONFIRMED = 'CONFIRMED';
    public const STATUS_CANCELED = 'CANCELED';

    protected $fillable = [
        'reference_date',
        'status',
        'created_by',
        'confirmed_by',
        'notes',
    ];

    protected $casts = [
        'reference_date' => 'date',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseSuggestionItem::class);
    }
}
