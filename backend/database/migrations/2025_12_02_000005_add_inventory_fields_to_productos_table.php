<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table): void {
            if (!Schema::hasColumn('productos', 'section')) {
                $table->string('section')->default('GROCERY');
            }

            if (!Schema::hasColumn('productos', 'shelf_life_days')) {
                $table->integer('shelf_life_days')->nullable();
            }

            if (!Schema::hasColumn('productos', 'current_sale_price')) {
                $table->decimal('current_sale_price', 12, 2)->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table): void {
            if (Schema::hasColumn('productos', 'section')) {
                $table->dropColumn('section');
            }
            if (Schema::hasColumn('productos', 'shelf_life_days')) {
                $table->dropColumn('shelf_life_days');
            }
            if (Schema::hasColumn('productos', 'current_sale_price')) {
                $table->dropColumn('current_sale_price');
            }
        });
    }
};
