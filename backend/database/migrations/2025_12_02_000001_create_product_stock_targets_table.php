<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product_stock_targets', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->constrained('productos');
            $table->decimal('min_stock', 12, 3)->default(0);
            $table->decimal('optimal_stock', 12, 3);
            $table->decimal('max_stock', 12, 3)->nullable();
            $table->integer('lead_time_days')->nullable();
            $table->integer('priority')->default(1);
            $table->timestamps();

            $table->index('product_id');
            $table->index(['priority', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_stock_targets');
    }
};
