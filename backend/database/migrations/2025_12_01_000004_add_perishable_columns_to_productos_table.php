<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table): void {
            $table->integer('shelf_life_days')->nullable()->after('estado');
            $table->boolean('perishable')->default(true)->after('shelf_life_days');
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table): void {
            $table->dropColumn(['shelf_life_days', 'perishable']);
        });
    }
};
