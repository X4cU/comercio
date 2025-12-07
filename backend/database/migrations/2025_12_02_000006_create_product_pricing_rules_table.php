<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product_pricing_rules', function (Blueprint $table): void {
            $table->id();
            $table->string('scope_type');
            $table->unsignedBigInteger('scope_id')->nullable();
            $table->decimal('default_margin_rate', 5, 2);
            $table->decimal('default_shrinkage_rate', 5, 2);
            $table->boolean('enabled')->default(true);
            $table->string('created_by');
            $table->timestamps();

            $table->index(['scope_type', 'scope_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_pricing_rules');
    }
};
