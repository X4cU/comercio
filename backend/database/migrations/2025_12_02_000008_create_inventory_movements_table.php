<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('inventory_movements', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->constrained('productos');
            $table->foreignId('product_batch_id')->nullable()->constrained('product_batches');
            $table->string('movement_type');
            $table->decimal('quantity', 12, 3);
            $table->dateTime('movement_date');
            $table->string('reason');
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->string('created_by');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};
