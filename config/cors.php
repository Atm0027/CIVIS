<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Configurable via environment variables in docker-compose.yml:
    | - CORS_ALLOWED_ORIGINS: Comma-separated list of allowed origins
    | - APP_URL: Used as fallback if CORS_ALLOWED_ORIGINS not set
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter(
        array_unique(
            array_merge(
                ['https://civis.pages.dev', 'http://localhost', 'http://localhost:8000'],
                array_map(
                    'trim',
                    explode(',', env('CORS_ALLOWED_ORIGINS', ''))
                )
            )
        )
    ),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
