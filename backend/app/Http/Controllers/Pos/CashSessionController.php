<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pos\CloseCashSessionRequest;
use App\Http\Requests\Pos\OpenCashSessionRequest;
use App\Models\CashRegister;
use App\Models\CashSession;
use App\Models\Sale;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CashSessionController extends Controller
{
    public function open(OpenCashSessionRequest $request): JsonResponse
    {
        $userId = (string) $request->user()?->getAuthIdentifier();
        $cashRegisterId = $request->integer('cash_register_id');
        $cashRegister = $cashRegisterId
            ? CashRegister::find($cashRegisterId)
            : CashRegister::where('is_active', true)->orderBy('id')->first();

        if (!$cashRegister) {
            $cashRegister = CashRegister::create([
                'name' => 'Caja principal',
                'location' => 'POS',
                'is_active' => true,
            ]);
        }

        if (!$cashRegister?->is_active) {
            throw new BadRequestHttpException('La caja seleccionada no está activa.');
        }

        $existingSession = CashSession::where('cash_register_id', $cashRegister->id)
            ->where('user_id', $userId)
            ->whereNull('closed_at')
            ->first();

        if ($existingSession) {
            throw new BadRequestHttpException('El usuario ya posee una sesión abierta en esta caja.');
        }

        $cashSession = CashSession::create([
            'cash_register_id' => $cashRegister->id,
            'user_id' => $userId,
            'opened_at' => Carbon::now(),
            'opening_amount' => $request->float('opening_amount'),
            'status' => 'OPEN',
            'notes' => $request->string('notes')->toString(),
        ]);

        return response()->json($cashSession, 201);
    }

    public function close(CloseCashSessionRequest $request): JsonResponse
    {
        $cashSession = CashSession::with(['sales.payments'])
            ->find($request->integer('cash_session_id'));

        if (!$cashSession || $cashSession->closed_at !== null) {
            throw new BadRequestHttpException('La sesión ya está cerrada o no existe.');
        }

        $totals = $this->buildSessionTotals($cashSession, $request->float('closing_amount'));

        $cashSession->update([
            'closed_at' => Carbon::now(),
            'closing_amount' => $request->float('closing_amount'),
            'status' => 'CLOSED',
            'notes' => $request->string('notes')->toString(),
        ]);

        return response()->json([
            'session' => $cashSession->fresh(),
            'summary' => $totals,
        ]);
    }

    public function current(): JsonResponse
    {
        $userId = (string) request()->user()?->getAuthIdentifier();

        $session = CashSession::where('user_id', $userId)
            ->whereNull('closed_at')
            ->latest('opened_at')
            ->first();

        return response()->json($session);
    }

    public function show(int $id): JsonResponse
    {
        $session = CashSession::with(['cashRegister', 'sales.payments'])->find($id);

        if (!$session) {
            throw new NotFoundHttpException('Sesión no encontrada');
        }

        return response()->json($session);
    }

    private function buildSessionTotals(CashSession $cashSession, ?float $declaredAmount = null): array
    {
        $sales = $cashSession->sales()->where('status', Sale::STATUS_COMPLETED)->with('payments')->get();
        $totalSales = $sales->sum('total');
        $paymentsByMethod = $sales->flatMap(fn (Sale $sale) => $sale->payments)
            ->groupBy('payment_method')
            ->map(fn ($group) => $group->sum('amount'));

        return [
            'total_sales' => $totalSales,
            'payments' => $paymentsByMethod,
            'difference' => $declaredAmount !== null
                ? $declaredAmount - $totalSales
                : null,
        ];
    }
}
