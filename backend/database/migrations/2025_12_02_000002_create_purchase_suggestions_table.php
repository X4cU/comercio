<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('purchase_suggestions', function (Blueprint $table): void {
            $table->id();
            $table->date('reference_date');
            $table->string('status')->default('DRAFT');
            $table->string('created_by');
            $table->string('confirmed_by')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_suggestions');
    }
};
