<?php

declare(strict_types=1);

namespace App\Http\Controllers\Offers;

use App\Http\Requests\Offers\CreateOfferRequest;
use App\Http\Requests\Offers\UpdateOfferRequest;
use App\Models\ProductOffer;
use App\Models\Producto;
use App\Services\Offers\OfferService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OfferController
{
    public function __construct(private readonly OfferService $offerService)
    {
    }

    public function active(Request $request): JsonResponse
    {
        $query = ProductOffer::with(['product'])
            ->when($request->filled('type'), fn ($q) => $q->where('type', $request->string('type')))
            ->when($request->filled('product_id'), fn ($q) => $q->where('product_id', $request->integer('product_id')))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('from'), fn ($q) => $q->where('valid_from', '>=', $request->date('from')))
            ->when($request->filled('to'), fn ($q) => $q->where('valid_until', '<=', $request->date('to')));

        $offers = $query->orderByDesc('valid_until')->get();

        return response()->json($offers);
    }

    public function show(int $id): JsonResponse
    {
        $offer = ProductOffer::with(['product', 'events'])->findOrFail($id);

        return response()->json($offer);
    }

    public function store(CreateOfferRequest $request): JsonResponse
    {
        $product = Producto::with('lifecycleStat')->findOrFail($request->integer('product_id'));
        $userId = $this->resolveUserId($request);

        $offer = $this->offerService->createOffer($product, $request->validated(), $userId);

        return response()->json($offer, 201);
    }

    public function update(UpdateOfferRequest $request, int $id): JsonResponse
    {
        $offer = ProductOffer::with(['product.lifecycleStat'])->findOrFail($id);
        $userId = $this->resolveUserId($request);

        $updated = $this->offerService->updateOffer($offer, $request->validated(), $userId);

        return response()->json($updated);
    }

    public function cancel(Request $request, int $id): JsonResponse
    {
        $offer = ProductOffer::findOrFail($id);
        $userId = $this->resolveUserId($request);

        $canceled = $this->offerService->cancelOffer($offer, $userId);

        return response()->json($canceled);
    }

    public function priceForProduct(int $productId): JsonResponse
    {
        $offer = $this->offerService->getActiveOfferForProduct($productId);

        if (!$offer) {
            return response()->json(null);
        }

        return response()->json([
            'type' => $offer->type,
            'discount_percentage' => (float) $offer->discount_percentage,
            'new_price' => (float) $offer->new_price,
            'valid_until' => $offer->valid_until,
        ]);
    }

    private function resolveUserId(Request $request): string
    {
        $user = $request->user();

        return (string) ($user?->getAttribute('sub') ?? $user?->id ?? 'system');
    }
}
