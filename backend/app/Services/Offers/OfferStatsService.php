<?php

declare(strict_types=1);

namespace App\Services\Offers;

use App\Models\ProductOffer;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class OfferStatsService
{
    public function top(array $filters = []): Collection
    {
        $query = ProductOffer::query()
            ->select([
                'product_id',
                DB::raw('SUM(CASE WHEN type = "PROMO" THEN 1 ELSE 0 END) as offer_count'),
                DB::raw('SUM(CASE WHEN type = "CLEARANCE" THEN 1 ELSE 0 END) as clearance_count'),
                DB::raw('SUM(affected_quantity) as total_affected_quantity'),
                DB::raw('AVG(discount_percentage) as avg_discount_percentage'),
            ])
            ->groupBy('product_id');

        if (!empty($filters['from'])) {
            $query->whereDate('created_at', '>=', Carbon::parse($filters['from']));
        }

        if (!empty($filters['to'])) {
            $query->whereDate('created_at', '<=', Carbon::parse($filters['to']));
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $limit = (int) ($filters['limit'] ?? 10);

        $results = $query
            ->orderByDesc('total_affected_quantity')
            ->limit($limit)
            ->get();

        return $results->map(function ($row) {
            return [
                'product_id' => (int) $row->product_id,
                'offer_count' => (int) $row->offer_count,
                'clearance_count' => (int) $row->clearance_count,
                'total_affected_quantity' => (float) $row->total_affected_quantity,
                'avg_discount_percentage' => (float) $row->avg_discount_percentage,
            ];
        });
    }
}
