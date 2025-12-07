<?php

declare(strict_types=1);

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Http\Requests\Finance\CreateFixedCostRequest;
use App\Http\Requests\Finance\UpdateFixedCostRequest;
use App\Models\FixedCost;
use App\Services\Finance\FixedCostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FixedCostController extends Controller
{
    public function __construct(private readonly FixedCostService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $filters = [];

        if ($request->has('is_active')) {
            $filters['is_active'] = $request->query('is_active');
        }

        if ($request->filled('search')) {
            $filters['search'] = $request->query('search');
        }

        $costs = $this->service->list($filters);

        return response()->json($costs);
    }

    public function store(CreateFixedCostRequest $request): JsonResponse
    {
        $userId = (string) ($request->user()?->getAuthIdentifier() ?? 'system');
        $fixedCost = $this->service->create($request->validated(), $userId);

        return response()->json($fixedCost, 201);
    }

    public function update(UpdateFixedCostRequest $request, int $id): JsonResponse
    {
        $userId = (string) ($request->user()?->getAuthIdentifier() ?? 'system');
        $fixedCost = FixedCost::findOrFail($id);
        $updated = $this->service->update($fixedCost, $request->validated(), $userId);

        return response()->json($updated);
    }

    public function dailyTotal(): JsonResponse
    {
        $totals = $this->service->dailyTotal();

        return response()->json($totals);
    }
}
