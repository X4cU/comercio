<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('purchase_suggestion_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('purchase_suggestion_id')->constrained('purchase_suggestions');
            $table->foreignId('product_id')->constrained('productos');
            $table->decimal('current_stock', 12, 3)->default(0);
            $table->decimal('optimal_stock', 12, 3);
            $table->decimal('min_stock', 12, 3)->default(0);
            $table->integer('projected_sales_days');
            $table->decimal('avg_daily_sales', 12, 3)->default(0);
            $table->decimal('safety_stock', 12, 3)->default(0);
            $table->decimal('recommended_qty', 12, 3)->default(0);
            $table->decimal('final_qty', 12, 3)->default(0);
            $table->json('reason_flags');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_suggestion_items');
    }
};
