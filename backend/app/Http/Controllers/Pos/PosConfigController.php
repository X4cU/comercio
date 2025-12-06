<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Services\Pos\PosConfigService;
use Illuminate\Http\JsonResponse;

class PosConfigController extends Controller
{
    public function __construct(private readonly PosConfigService $posConfigService)
    {
    }

    public function __invoke(): JsonResponse
    {
        return response()->json($this->posConfigService->getConfig());
    }
}
