<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('promotions', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('scope_type');
            $table->unsignedBigInteger('scope_id')->nullable();
            $table->string('discount_type')->default('PERCENTAGE');
            $table->decimal('discount_value', 5, 2);
            $table->decimal('min_quantity', 12, 3)->nullable();
            $table->dateTime('valid_from');
            $table->dateTime('valid_until')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('priority')->default(1);
            $table->string('created_by');
            $table->string('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['scope_type', 'scope_id']);
            $table->index('is_active');
            $table->index('valid_from');
            $table->index('valid_until');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
