<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table): void {
            if (!Schema::hasColumn('sales', 'payment_method')) {
                $table->string('payment_method')->nullable()->after('mode');
            }
            if (!Schema::hasColumn('sales', 'applied_discount_percentage')) {
                $table->decimal('applied_discount_percentage', 5, 2)->default(0)->after('discount_total');
            }
            if (!Schema::hasColumn('sales', 'low_stock_flag')) {
                $table->boolean('low_stock_flag')->default(false)->after('status');
            }
        });

        Schema::table('sale_items', function (Blueprint $table): void {
            if (!Schema::hasColumn('sale_items', 'insufficient_stock')) {
                $table->boolean('insufficient_stock')->default(false)->after('discount_amount');
            }
        });
    }

    public function down(): void
    {
        Schema::table('sale_items', function (Blueprint $table): void {
            if (Schema::hasColumn('sale_items', 'insufficient_stock')) {
                $table->dropColumn('insufficient_stock');
            }
        });

        Schema::table('sales', function (Blueprint $table): void {
            if (Schema::hasColumn('sales', 'low_stock_flag')) {
                $table->dropColumn('low_stock_flag');
            }
            if (Schema::hasColumn('sales', 'applied_discount_percentage')) {
                $table->dropColumn('applied_discount_percentage');
            }
            if (Schema::hasColumn('sales', 'payment_method')) {
                $table->dropColumn('payment_method');
            }
        });
    }
};
