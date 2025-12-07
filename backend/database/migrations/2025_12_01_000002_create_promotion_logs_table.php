<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('promotion_logs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('promotion_id')->constrained('promotions');
            $table->string('event_type');
            $table->dateTime('event_at');
            $table->string('user_id');
            $table->jsonb('payload')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotion_logs');
    }
};
