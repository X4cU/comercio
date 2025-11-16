<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Auth\KeycloakUser;
use App\Exceptions\KeycloakTokenException;
use App\Services\KeycloakJwtDecoder;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class KeycloakJwtMiddleware
{
    public function __construct(private KeycloakJwtDecoder $decoder)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $authHeader = $request->header('Authorization', '');
        if (!str_starts_with($authHeader, 'Bearer ')) {
            return $this->unauthorized('Missing or invalid Authorization header');
        }

        $token = trim(substr($authHeader, 7));
        if ($token === '') {
            return $this->unauthorized('Missing or invalid Authorization header');
        }

        try {
            $payload = $this->decoder->decode($token);
        } catch (KeycloakTokenException $e) {
            return $this->unauthorized($e->getMessage());
        }

        $user = [
            'sub' => $payload['sub'],
            'username' => $payload['preferred_username'] ?? $payload['sub'],
            'email' => $payload['email'] ?? null,
            'name' => $payload['name'] ?? null,
            'roles' => array_values(array_unique(array_merge(
                $payload['realm_roles'] ?? [],
                $payload['client_roles'] ?? []
            ))),
        ];

        $request->attributes->set('kc_user', $user);
        Auth::setUser(new KeycloakUser($user));

        return $next($request);
    }

    private function unauthorized(string $message): JsonResponse
    {
        return response()->json(['message' => $message], Response::HTTP_UNAUTHORIZED);
    }
}
