<?php

declare(strict_types=1);

namespace App\Http\Controllers\Promotions;

use App\Http\Controllers\Controller;
use App\Http\Requests\Promotions\CheckPromotionRequest;
use App\Http\Requests\Promotions\CreatePromotionRequest;
use App\Http\Requests\Promotions\UpdatePromotionRequest;
use App\Models\Promotion;
use App\Models\Producto;
use App\Services\Promotions\PromotionEngine;
use App\Services\Promotions\PromotionService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function __construct(
        private readonly PromotionService $promotionService,
        private readonly PromotionEngine $promotionEngine,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $query = Promotion::query()->with(['product']);

        if ($request->filled('estado') && $request->string('estado') !== 'todas') {
            $estado = $request->string('estado');
            $now = Carbon::now();

            if ($estado === 'activa') {
                $query->where('is_active', true)
                    ->where(function ($q) use ($now) {
                        $q->whereNull('valid_from')->orWhere('valid_from', '<=', $now);
                    })
                    ->where(function ($q) use ($now) {
                        $q->whereNull('valid_until')->orWhere('valid_until', '>=', $now);
                    });
            }

            if ($estado === 'programada') {
                $query->where('is_active', true)
                    ->whereNotNull('valid_from')
                    ->where('valid_from', '>', $now);
            }

            if ($estado === 'vencida') {
                $query->whereNotNull('valid_until')->where('valid_until', '<', $now);
            }
        }

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where('name', 'like', "%{$search}%");
        }

        $promotions = $query
            ->orderByRaw("CASE WHEN is_active = 1 THEN 0 ELSE 1 END")
            ->orderByRaw("CASE WHEN valid_until IS NULL THEN 0 ELSE 1 END")
            ->orderByDesc('valid_until')
            ->orderBy('valid_from')
            ->orderByDesc('created_at')
            ->paginate(15);

        return response()->json($promotions);
    }

    public function show(int $id): JsonResponse
    {
        $promotion = Promotion::query()->with(['product', 'logs'])->findOrFail($id);

        return response()->json($promotion);
    }

    public function store(CreatePromotionRequest $request): JsonResponse
    {
        $promotion = $this->promotionService->createPromotion(
            $request->validated(),
            $this->resolveUserId($request)
        );

        return response()->json($promotion, 201);
    }

    public function update(UpdatePromotionRequest $request, int $id): JsonResponse
    {
        $promotion = Promotion::query()->findOrFail($id);

        $updated = $this->promotionService->updatePromotion($promotion, $request->validated(), $this->resolveUserId($request));

        return response()->json($updated);
    }

    public function toggle(Request $request, int $id): JsonResponse
    {
        $promotion = Promotion::query()->findOrFail($id);
        $toggled = $this->promotionService->togglePromotion($promotion, $this->resolveUserId($request));

        return response()->json($toggled);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $promotion = Promotion::query()->findOrFail($id);
        $this->promotionService->deletePromotion($promotion, $this->resolveUserId($request));

        return response()->json(['message' => 'Promotion deleted']);
    }

    public function check(CheckPromotionRequest $request): JsonResponse
    {
        $productId = $request->integer('product_id');
        $quantity = (float) $request->input('quantity');
        $at = $request->filled('datetime') ? Carbon::parse($request->string('datetime')) : Carbon::now();

        $promotion = $this->promotionEngine->findApplicablePromotionForProduct($productId, $quantity, $at);

        if ($promotion) {
            return response()->json([
                'promotion_applicable' => true,
                'promotion' => $promotion,
                'reason' => null,
            ]);
        }

        $reason = $this->resolveRejectionReason($productId, $quantity, $at);

        return response()->json([
            'promotion_applicable' => false,
            'promotion' => null,
            'reason' => $reason,
        ]);
    }

    private function resolveRejectionReason(int $productId, float $quantity, Carbon $at): string
    {
        $baseQuery = Promotion::query()
            ->where('is_active', true)
            ->where(function ($query) use ($productId) {
                $query->where(function ($q) use ($productId) {
                    $q->where('scope_type', Promotion::SCOPE_PRODUCT)->where('scope_id', $productId);
                })
                    ->orWhere('scope_type', Promotion::SCOPE_GLOBAL)
                    ->orWhere(function ($q) use ($productId) {
                        $category = Producto::query()->find($productId)?->categoria;
                        if ($category) {
                            $q->where('scope_type', Promotion::SCOPE_CATEGORY)->where('scope_id', $category);
                        }
                    });
            });

        $anyPromotion = (clone $baseQuery)->exists();
        if (!$anyPromotion) {
            return 'No hay promociones configuradas para este producto.';
        }

        $validInTime = (clone $baseQuery)
            ->where(function ($query) use ($at) {
                $query->whereNull('valid_from')->orWhere('valid_from', '<=', $at);
            })
            ->where(function ($query) use ($at) {
                $query->whereNull('valid_until')->orWhere('valid_until', '>=', $at);
            })
            ->exists();

        if (!$validInTime) {
            return 'La promoción está fuera de vigencia.';
        }

        $meetsQuantity = (clone $baseQuery)
            ->where(function ($query) use ($quantity) {
                $query->whereNull('min_quantity')->orWhere('min_quantity', '<=', $quantity);
            })
            ->exists();

        if (!$meetsQuantity) {
            return 'La cantidad es menor a la mínima requerida.';
        }

        return 'No hay promociones aplicables.';
    }

    private function resolveUserId(Request $request): string
    {
        $user = $request->user();

        return (string) ($user?->getAttribute('sub') ?? $user?->id ?? 'system');
    }
}
