<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureSuperAdmin
{
    public function handle(Request $request, Closure $next): JsonResponse|Response
    {
        $user = Auth::user();
        $roles = [];

        if ($user && method_exists($user, 'getAttribute')) {
            $roles = (array) $user->getAttribute('roles', []);
        } elseif ($user && property_exists($user, 'roles')) {
            $roles = (array) $user->roles;
        } elseif ($request->attributes->has('kc_user')) {
            $roles = (array) ($request->attributes->get('kc_user')['roles'] ?? []);
        }

        if (!in_array('superadmin', $roles, true)) {
            return response()->json(['message' => 'Acceso no autorizado'], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
