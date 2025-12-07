<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product_batches', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->constrained('productos');
            $table->string('batch_code')->nullable();
            $table->date('arrival_date');
            $table->date('expiration_date')->nullable();
            $table->decimal('quantity_received', 12, 3);
            $table->decimal('quantity_remaining', 12, 3);
            $table->decimal('gross_cost_per_bulk', 12, 2);
            $table->decimal('bulk_units', 12, 3);
            $table->decimal('initial_shrinkage_rate', 5, 2);
            $table->decimal('margin_rate', 5, 2);
            $table->decimal('base_price', 12, 2);
            $table->decimal('final_price', 12, 2);
            $table->string('section');
            $table->text('notes')->nullable();
            $table->string('created_by');
            $table->timestamps();

            $table->index('product_id');
            $table->index('section');
            $table->index('expiration_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_batches');
    }
};
