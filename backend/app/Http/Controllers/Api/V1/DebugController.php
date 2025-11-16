<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class DebugController extends Controller
{
    /**
     * Display environment debug data.
     */
    public function env(): JsonResponse
    {
        return response()->json([
            'app_env' => config('app.env'),
            'app_debug' => config('app.debug'),
            'db_connection' => config('database.default'),
            'keycloak_realm' => env('KEYCLOAK_REALM'),
        ]);
    }
}
