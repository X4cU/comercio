<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyClosure extends Model
{
    use HasFactory;

    public const STATUS_CLOSED = 'CLOSED';
    public const STATUS_ANNULLED = 'ANNULLED';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'closure_date',
        'total_sales',
        'total_fixed_costs',
        'gross_profit',
        'notes',
        'created_by',
        'status',
        'annulled_by',
        'annulled_at',
    ];

    protected $casts = [
        'closure_date' => 'date',
        'total_sales' => 'decimal:2',
        'total_fixed_costs' => 'decimal:2',
        'gross_profit' => 'decimal:2',
        'annulled_at' => 'datetime',
    ];
}
