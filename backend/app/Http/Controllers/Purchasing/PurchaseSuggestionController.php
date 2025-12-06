<?php

declare(strict_types=1);

namespace App\Http\Controllers\Purchasing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Purchasing\GenerateSuggestionRequest;
use App\Http\Requests\Purchasing\UpdateSuggestionItemRequest;
use App\Models\PurchaseSuggestion;
use App\Models\PurchaseSuggestionItem;
use App\Services\Purchasing\PurchaseSuggestionService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseSuggestionController extends Controller
{
    public function __construct(private readonly PurchaseSuggestionService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $query = PurchaseSuggestion::query()->orderByDesc('reference_date');

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('from')) {
            $query->whereDate('reference_date', '>=', $request->date('from'));
        }

        if ($request->filled('to')) {
            $query->whereDate('reference_date', '<=', $request->date('to'));
        }

        $suggestions = $query->paginate(10);

        return response()->json($suggestions);
    }

    public function show(int $id): JsonResponse
    {
        $suggestion = PurchaseSuggestion::with(['items.product'])->findOrFail($id);

        return response()->json($suggestion);
    }

    public function generate(GenerateSuggestionRequest $request): JsonResponse
    {
        $referenceDate = $request->date('reference_date', now());
        $projectedDays = $request->integer('projected_sales_days', 3);
        $userId = (string) ($request->user()?->getAuthIdentifier() ?? 'system');

        $suggestion = $this->service->generateForDate(Carbon::parse($referenceDate), $projectedDays, $userId);

        return response()->json($suggestion->load('items.product'));
    }

    public function updateItem(UpdateSuggestionItemRequest $request, int $id, int $itemId): JsonResponse
    {
        $suggestion = PurchaseSuggestion::findOrFail($id);

        if ($suggestion->status !== PurchaseSuggestion::STATUS_DRAFT) {
            return response()->json(['message' => 'La sugerencia no admite modificaciones.'], 422);
        }

        $item = PurchaseSuggestionItem::where('purchase_suggestion_id', $id)->findOrFail($itemId);
        $item->update($request->validated());

        return response()->json($item);
    }

    public function confirm(int $id, Request $request): JsonResponse
    {
        $suggestion = PurchaseSuggestion::findOrFail($id);

        if ($suggestion->status !== PurchaseSuggestion::STATUS_DRAFT) {
            return response()->json(['message' => 'Solo se pueden confirmar borradores.'], 422);
        }

        $suggestion->update([
            'status' => PurchaseSuggestion::STATUS_CONFIRMED,
            'confirmed_by' => (string) ($request->user()?->getAuthIdentifier() ?? 'system'),
        ]);

        return response()->json($suggestion);
    }

    public function cancel(int $id): JsonResponse
    {
        $suggestion = PurchaseSuggestion::findOrFail($id);

        if ($suggestion->status !== PurchaseSuggestion::STATUS_DRAFT) {
            return response()->json(['message' => 'Solo se pueden cancelar borradores.'], 422);
        }
        $suggestion->update(['status' => PurchaseSuggestion::STATUS_CANCELED]);

        return response()->json($suggestion);
    }

    public function export(int $id): JsonResponse
    {
        $suggestion = PurchaseSuggestion::with(['items.product'])->findOrFail($id);

        return response()->json([
            'suggestion' => $suggestion,
            'items' => $suggestion->items,
        ]);
    }
}
