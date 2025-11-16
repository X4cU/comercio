<?php

declare(strict_types=1);

use Illuminate\Foundation\Application;
use Illuminate\Contracts\Console\Kernel as ConsoleKernelContract;
use Illuminate\Contracts\Debug\ExceptionHandler;

$app = new Application(
    $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
);

$app->singleton(
    Illuminate\Contracts\Http\Kernel::class,
    App\Http\Kernel::class
);

$app->singleton(
    ConsoleKernelContract::class,
    App\Console\Kernel::class
);

$app->singleton(
    ExceptionHandler::class,
    App\Exceptions\Handler::class
);

return $app;
