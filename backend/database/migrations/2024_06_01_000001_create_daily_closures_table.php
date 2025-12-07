<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('daily_closures', function (Blueprint $table): void {
            $table->id();
            $table->date('closure_date');
            $table->decimal('total_sales', 12, 2);
            $table->decimal('total_fixed_costs', 12, 2);
            $table->decimal('gross_profit', 12, 2);
            $table->text('notes')->nullable();
            $table->string('created_by');
            $table->string('status');
            $table->string('annulled_by')->nullable();
            $table->timestamp('annulled_at')->nullable();
            $table->timestamps();

            $table->unique('closure_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_closures');
    }
};
