<?php

namespace App\Services;

use App\Exceptions\KeycloakTokenException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class KeycloakJwtDecoder
{
    public function decode(string $token): array
    {
        $config = config('keycloak');
        $issuer = rtrim($config['base_url'], '/') . '/realms/' . $config['realm'];
        $publicKey = $this->formatPublicKey($config['realm_public_key']);

        if (empty($publicKey)) {
            throw new KeycloakTokenException('Realm public key not configured');
        }

        try {
            $decoded = JWT::decode($token, new Key($publicKey, $config['allowed_alg']));
        } catch (\Throwable $e) {
            throw new KeycloakTokenException('Invalid token: ' . $e->getMessage());
        }

        if (($decoded->iss ?? null) !== $issuer) {
            throw new KeycloakTokenException('Invalid token issuer');
        }

        $aud = $decoded->aud ?? null;
        $audiences = is_array($aud) ? $aud : [$aud];
        if (!in_array($config['client_id'], array_filter($audiences))) {
            throw new KeycloakTokenException('Invalid token audience');
        }

        $realmAccess = [];
        if (isset($decoded->realm_access, $decoded->realm_access->roles)) {
            $realmAccess = (array) $decoded->realm_access->roles;
        }

        $resourceAccess = [];
        if (isset($decoded->resource_access) && isset($decoded->resource_access->{$config['client_id']})) {
            $clientAccess = $decoded->resource_access->{$config['client_id']};
            if (isset($clientAccess->roles)) {
                $resourceAccess = (array) $clientAccess->roles;
            }
        }

        return [
            'sub' => $decoded->sub ?? null,
            'preferred_username' => $decoded->preferred_username ?? null,
            'email' => $decoded->email ?? null,
            'name' => $decoded->name ?? null,
            'realm_roles' => $realmAccess,
            'client_roles' => $resourceAccess,
        ];
    }

    private function formatPublicKey(?string $key): string
    {
        if (!$key) {
            return '';
        }

        if (!str_contains($key, 'BEGIN PUBLIC KEY')) {
            $key = "-----BEGIN PUBLIC KEY-----\n" . trim($key) . "\n-----END PUBLIC KEY-----";
        }

        return $key;
    }
}
