<?php

declare(strict_types=1);

namespace App\Services\Finance;

use App\Models\FixedCost;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class FixedCostService
{
    public function list(array $filters = []): LengthAwarePaginator
    {
        /** @var Builder $query */
        $query = FixedCost::query()->orderBy('name');

        if (array_key_exists('is_active', $filters) && $filters['is_active'] !== null) {
            $query->where('is_active', filter_var((string) $filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        if (!empty($filters['search'])) {
            $query->where('name', 'ilike', '%' . $filters['search'] . '%');
        }

        return $query->paginate(15);
    }

    public function create(array $data, string $userId): FixedCost
    {
        return FixedCost::create([
            'name' => $data['name'],
            'monthly_amount' => $data['monthly_amount'],
            'is_active' => $data['is_active'] ?? true,
            'notes' => $data['notes'] ?? null,
            'created_by' => $userId,
            'updated_by' => $userId,
        ]);
    }

    public function update(FixedCost $fixedCost, array $data, string $userId): FixedCost
    {
        $fixedCost->update([
            'name' => $data['name'] ?? $fixedCost->name,
            'monthly_amount' => $data['monthly_amount'] ?? $fixedCost->monthly_amount,
            'is_active' => $data['is_active'] ?? $fixedCost->is_active,
            'notes' => $data['notes'] ?? $fixedCost->notes,
            'updated_by' => $userId,
        ]);

        return $fixedCost;
    }

    public function dailyTotal(?Carbon $date = null): array
    {
        $date = $date ?? Carbon::now();
        /** @var Collection<int, FixedCost> $activeCosts */
        $activeCosts = FixedCost::query()->where('is_active', true)->get();
        $totalMonthly = $activeCosts->sum(function (FixedCost $cost): float {
            return (float) $cost->monthly_amount;
        });
        $daysInMonth = $date->daysInMonth;
        $dailyCost = $daysInMonth > 0 ? $totalMonthly / $daysInMonth : 0.0;

        return [
            'daily_cost' => round($dailyCost, 2),
            'total_monthly_costs' => round($totalMonthly, 2),
            'days_in_month' => $daysInMonth,
        ];
    }
}
