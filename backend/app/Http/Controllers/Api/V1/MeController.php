<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MeController
{
    public function show(Request $request): JsonResponse
    {
        $kcUser = $request->attributes->get('kc_user', []);

        return response()->json([
            'sub' => $kcUser['sub'] ?? null,
            'username' => $kcUser['username'] ?? null,
            'email' => $kcUser['email'] ?? null,
            'roles' => $kcUser['roles'] ?? [],
            'source' => 'keycloak',
        ]);
    }
}
