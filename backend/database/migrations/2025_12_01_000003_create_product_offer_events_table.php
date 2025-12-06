<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product_offer_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_offer_id')->constrained('product_offers');
            $table->string('event_type');
            $table->dateTime('event_at');
            $table->string('user_id');
            $table->json('payload')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_offer_events');
    }
};
