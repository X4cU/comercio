<?php

declare(strict_types=1);

namespace App\Http\Controllers\Offers;

use App\Services\Offers\OfferSuggestionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OfferSuggestionController
{
    public function __construct(private readonly OfferSuggestionService $suggestionService)
    {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $filters = $request->only(['suggested_type', 'min_remaining_days', 'max_remaining_days']);

        $suggestions = $this->suggestionService->getSuggestions($filters);

        return response()->json($suggestions);
    }
}
