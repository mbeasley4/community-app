<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->string('slug')->unique(); // 'cohort', 'foundation', etc
            $table->string('name');
            $table->text('description')->nullable();

            $table->integer('price_cents'); // store as integer (32500)
            $table->string('stripe_price_id')->unique();

            // Entitlements
            $table->boolean('includes_cohort')->default(false);

            // Optional UI hint
            $table->boolean('highlight')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
