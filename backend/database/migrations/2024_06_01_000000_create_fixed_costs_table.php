<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('fixed_costs', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->decimal('monthly_amount', 12, 2);
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->string('created_by');
            $table->string('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fixed_costs');
    }
};
