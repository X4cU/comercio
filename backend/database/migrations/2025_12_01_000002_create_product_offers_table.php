<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product_offers', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->constrained('productos');
            $table->string('type');
            $table->string('status');
            $table->string('source');
            $table->decimal('discount_percentage', 5, 2);
            $table->decimal('affected_quantity', 12, 3);
            $table->decimal('old_price', 12, 2);
            $table->decimal('new_price', 12, 2);
            $table->dateTime('valid_from');
            $table->dateTime('valid_until');
            $table->text('notes')->nullable();
            $table->string('created_by');
            $table->string('activated_by')->nullable();
            $table->string('canceled_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('product_id');
            $table->index('status');
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_offers');
    }
};
