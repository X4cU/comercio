<?php

declare(strict_types=1);

namespace App\Services\Finance;

use App\Models\DailyClosure;
use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class DailyClosureService
{
    public function __construct(private readonly FixedCostService $fixedCostService, private readonly DatabaseManager $db)
    {
    }

    public function todaySummary(?Carbon $date = null): array
    {
        $date = $date ?? Carbon::today();
        $salesQuery = Sale::query()
            ->where('status', Sale::STATUS_COMPLETED)
            ->whereDate('created_at', $date);

        $totalSales = (float) $salesQuery->sum('total');
        $paymentTotals = $this->paymentTotalsByMethod($date);
        $dailyCostData = $this->fixedCostService->dailyTotal($date);

        $existingClosure = DailyClosure::query()->whereDate('closure_date', $date)->first();

        return [
            'date' => $date->toDateString(),
            'total_sales' => round($totalSales, 2),
            'payment_totals' => $paymentTotals,
            'daily_cost' => $dailyCostData['daily_cost'],
            'gross_profit' => round($totalSales - $dailyCostData['daily_cost'], 2),
            'closure' => $existingClosure,
        ];
    }

    public function createClosure(string $userId, ?Carbon $date = null, ?string $notes = null): DailyClosure
    {
        $date = $date ?? Carbon::today();
        $summary = $this->todaySummary($date);

        if ($summary['closure']) {
            throw new RuntimeException('Ya existe un cierre para esta fecha.');
        }

        return $this->db->transaction(function () use ($summary, $userId, $date, $notes) {
            return DailyClosure::create([
                'closure_date' => $date->toDateString(),
                'total_sales' => $summary['total_sales'],
                'total_fixed_costs' => $summary['daily_cost'],
                'gross_profit' => $summary['gross_profit'],
                'notes' => $notes,
                'created_by' => $userId,
                'status' => DailyClosure::STATUS_CLOSED,
            ]);
        });
    }

    public function list(int $perPage = 15): LengthAwarePaginator
    {
        return DailyClosure::query()->orderByDesc('closure_date')->paginate($perPage);
    }

    public function annul(DailyClosure $closure, string $userId): DailyClosure
    {
        if ($closure->status === DailyClosure::STATUS_ANNULLED) {
            return $closure;
        }

        $closure->update([
            'status' => DailyClosure::STATUS_ANNULLED,
            'annulled_by' => $userId,
            'annulled_at' => Carbon::now(),
        ]);

        return $closure;
    }

    /**
     * @return array<int, array{payment_method:string,total:float}>
     */
    private function paymentTotalsByMethod(Carbon $date): array
    {
        /** @var Builder $query */
        $query = DB::table('payments')
            ->select('payment_method', DB::raw('SUM(amount) as total'))
            ->whereExists(function ($subQuery) use ($date): void {
                $subQuery->select(DB::raw(1))
                    ->from('sales')
                    ->whereColumn('sales.id', 'payments.sale_id')
                    ->where('sales.status', Sale::STATUS_COMPLETED)
                    ->whereDate('sales.created_at', $date);
            })
            ->groupBy('payment_method');

        return $query->get()->map(fn ($row) => [
            'payment_method' => (string) $row->payment_method,
            'total' => round((float) $row->total, 2),
        ])->toArray();
    }
}
