<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pos\CreateSaleRequest;
use App\Models\Sale;
use App\Services\Pos\SaleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class SaleController extends Controller
{
    public function __construct(private readonly SaleService $saleService)
    {
    }

    public function store(CreateSaleRequest $request): JsonResponse
    {
        $userId = (string) $request->user()?->getAuthIdentifier();
        $roles = $request->user()?->getAttribute('roles', []) ?? [];

        $sale = $this->saleService->createSale($request->validated(), $userId, $roles);

        return response()->json($sale, 201);
    }

    public function show(int $id): JsonResponse
    {
        $sale = Sale::with(['items', 'payments', 'cashSession.cashRegister'])->find($id);

        if (!$sale) {
            throw new NotFoundHttpException('Venta no encontrada');
        }

        return response()->json($sale);
    }

    public function cancel(int $id, Request $request): JsonResponse
    {
        $userId = (string) $request->user()?->getAuthIdentifier();
        $sale = $this->saleService->cancelSale($id, $userId);

        return response()->json($sale);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Sale::with(['cashSession', 'payments'])
            ->when($request->filled('from'), fn ($q) => $q->whereDate('created_at', '>=', $request->date('from')))
            ->when($request->filled('to'), fn ($q) => $q->whereDate('created_at', '<=', $request->date('to')))
            ->when($request->filled('user_id'), fn ($q) => $q->where('user_id', $request->get('user_id')))
            ->when($request->filled('cash_register_id'), function ($q) use ($request) {
                return $q->whereHas('cashSession', fn ($sessionQuery) => $sessionQuery->where('cash_register_id', $request->get('cash_register_id')));
            })
            ->orderByDesc('created_at');

        $sales = $query->paginate(15);

        return response()->json($sales);
    }
}
