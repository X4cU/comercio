<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product_lifecycle_stats', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->constrained('productos');
            $table->date('last_purchase_date')->nullable();
            $table->date('last_sale_date')->nullable();
            $table->integer('estimated_shelf_life_days')->nullable();
            $table->decimal('avg_daily_sales', 12, 3)->nullable();
            $table->decimal('total_purchased_units', 12, 3)->default(0);
            $table->decimal('total_sold_units', 12, 3)->default(0);
            $table->timestamps();

            $table->index('product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_lifecycle_stats');
    }
};
