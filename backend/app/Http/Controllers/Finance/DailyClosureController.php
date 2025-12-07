<?php

declare(strict_types=1);

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\DailyClosure;
use App\Services\Finance\DailyClosureService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class DailyClosureController extends Controller
{
    public function __construct(private readonly DailyClosureService $service)
    {
    }

    public function today(): JsonResponse
    {
        $summary = $this->service->todaySummary();

        return response()->json($summary);
    }

    public function store(Request $request): JsonResponse
    {
        $userId = (string) ($request->user()?->getAuthIdentifier() ?? 'system');

        try {
            $closure = $this->service->createClosure($userId, notes: $request->string('notes', null));
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json($closure, 201);
    }

    public function index(): JsonResponse
    {
        $closures = $this->service->list();

        return response()->json($closures);
    }

    public function show(int $id): JsonResponse
    {
        $closure = DailyClosure::findOrFail($id);

        return response()->json($closure);
    }

    public function annul(int $id, Request $request): JsonResponse
    {
        $closure = DailyClosure::findOrFail($id);
        $userId = (string) ($request->user()?->getAuthIdentifier() ?? 'system');
        $annulled = $this->service->annul($closure, $userId);

        return response()->json($annulled);
    }
}
