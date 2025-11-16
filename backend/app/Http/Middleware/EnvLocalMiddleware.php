<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnvLocalMiddleware
{
    /**
     * Ensure the current environment is local.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! app()->environment('local')) {
            return new JsonResponse([
                'message' => 'Forbidden in this environment',
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
