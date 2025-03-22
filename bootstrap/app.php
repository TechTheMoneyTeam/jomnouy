<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
        $middleware->validateCsrfTokens(except: [
            'stripe/*',
            'http://example.com/foo/bar',
            'http://localhost:8000/api/projects',
            'http://localhost:8000/api/*',
            'http://localhost:8000/*',
            'http://127.0.0.1:8000/api/settings/change-password',
            'http://127.0.0.1:8000/api/settings/change-password1',
            'http://localhost:8000/api/settings/change-password',
            'http://127.0.0.1:8000/api/profile/update'

            
            
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
