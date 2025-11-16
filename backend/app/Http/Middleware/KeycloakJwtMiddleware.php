<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class KeycloakJwtMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // TODO: Fase 4 - validar token JWT emitido por Keycloak.
        // Se deberá extraer sub, preferred_username y roles
        // para vincularlos con el dominio de Comercio.
        // En local se permite simular un usuario con un header especial.
        if (app()->environment('local') && $request->hasHeader('X-Debug-User')) {
            $request->merge([
                'debug_user' => $request->header('X-Debug-User'),
            ]);
        }

        return $next($request);
    }
}
