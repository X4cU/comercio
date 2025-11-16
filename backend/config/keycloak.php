<?php

return [
    'base_url' => env('KEYCLOAK_BASE_URL', 'http://comercio_keycloak:8080'),
    'realm' => env('KEYCLOAK_REALM', 'Comercio'),
    'client_id' => env('KEYCLOAK_CLIENT_ID', 'comercio-backend'),
    'client_secret' => env('KEYCLOAK_CLIENT_SECRET'),
    'realm_public_key' => env('KEYCLOAK_REALM_PUBLIC_KEY'),
    'allowed_alg' => 'RS256',
];
