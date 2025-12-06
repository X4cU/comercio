<?php

declare(strict_types=1);

namespace App\Http\Controllers\Offers;

use App\Services\Offers\OfferStatsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OfferStatsController
{
    public function __construct(private readonly OfferStatsService $statsService)
    {
    }

    public function top(Request $request): JsonResponse
    {
        $filters = $request->only(['from', 'to', 'limit', 'type', 'status']);
        $data = $this->statsService->top($filters);

        return response()->json($data);
    }
}
