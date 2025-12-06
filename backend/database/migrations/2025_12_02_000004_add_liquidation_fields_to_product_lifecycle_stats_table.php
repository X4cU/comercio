<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('product_lifecycle_stats', function (Blueprint $table): void {
            $table->integer('liquidation_count')->default(0);
            $table->timestamp('last_liquidation_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('product_lifecycle_stats', function (Blueprint $table): void {
            $table->dropColumn(['liquidation_count', 'last_liquidation_at']);
        });
    }
};
