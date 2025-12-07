<?php

declare(strict_types=1);

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\CreateNewMerchandiseRequest;
use App\Http\Requests\Inventory\CreatePricingRuleRequest;
use App\Http\Requests\Inventory\UpdatePricingRuleRequest;
use App\Models\ProductBatch;
use App\Models\ProductPricingRule;
use App\Models\Producto;
use App\Services\Inventory\NewMerchandiseService;
use App\Services\Inventory\PricingRuleResolver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewMerchandiseController extends Controller
{
    public function __construct(
        private NewMerchandiseService $newMerchandiseService,
        private PricingRuleResolver $pricingRuleResolver,
    ) {
    }

    public function pricingRules(Request $request): JsonResponse
    {
        $query = ProductPricingRule::query();

        if ($request->filled('scope_type')) {
            $query->where('scope_type', $request->string('scope_type'));
        }
        if ($request->filled('enabled')) {
            $query->where('enabled', $request->boolean('enabled'));
        }

        return response()->json($query->orderByDesc('created_at')->get());
    }

    public function storePricingRule(CreatePricingRuleRequest $request): JsonResponse
    {
        $exists = ProductPricingRule::query()
            ->where('scope_type', $request->input('scope_type'))
            ->where('scope_id', $request->input('scope_id'))
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Rule already exists for scope'], 422);
        }

        $rule = ProductPricingRule::query()->create([
            'scope_type' => $request->input('scope_type'),
            'scope_id' => $request->input('scope_id'),
            'default_margin_rate' => $request->input('default_margin_rate'),
            'default_shrinkage_rate' => $request->input('default_shrinkage_rate'),
            'enabled' => $request->boolean('enabled'),
            'created_by' => $request->user()?->sub ?? 'system',
        ]);

        return response()->json($rule, 201);
    }

    public function updatePricingRule(UpdatePricingRuleRequest $request, int $id): JsonResponse
    {
        $rule = ProductPricingRule::query()->findOrFail($id);
        $rule->fill($request->validated());
        $rule->save();

        return response()->json($rule);
    }

    public function config(Request $request): JsonResponse
    {
        $productId = $request->integer('product_id');
        $product = $productId ? Producto::query()->find($productId) : null;

        $defaults = $product ? $this->pricingRuleResolver->resolveForProduct($product) : ['margin' => 0, 'shrinkage' => 0];

        return response()->json([
            'sections' => ['GROCERY', 'PRODUCE', 'DELI'],
            'pricing_defaults' => $defaults,
        ]);
    }

    public function store(CreateNewMerchandiseRequest $request): JsonResponse
    {
        $batch = $this->newMerchandiseService->createBatch($request->validated(), $request->user()?->sub ?? 'system');

        $totalStock = ProductBatch::query()
            ->where('product_id', $batch->product_id)
            ->sum('quantity_remaining');

        return response()->json([
            'batch' => $batch,
            'total_stock' => $totalStock,
        ], 201);
    }

    public function batches(Request $request): JsonResponse
    {
        $query = ProductBatch::query()->with('product');

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->integer('product_id'));
        }
        if ($request->filled('section')) {
            $query->where('section', $request->string('section'));
        }

        return response()->json($query->orderByDesc('arrival_date')->paginate(15));
    }

    public function show(int $id): JsonResponse
    {
        $batch = ProductBatch::query()->with('product')->findOrFail($id);

        return response()->json($batch);
    }
}
