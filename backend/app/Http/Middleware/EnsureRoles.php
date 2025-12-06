<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class EnsureRoles
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        $user = $request->user();
        $userRoles = collect($user?->getAttribute('roles', []) ?? []);

        if ($userRoles->intersect($roles)->isEmpty()) {
            throw new AccessDeniedHttpException('User does not have the required role');
        }

        return $next($request);
    }
}
