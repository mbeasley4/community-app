<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('purchase_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->string('product_type'); 
            // course | bundle | subscription | etc

            $table->unsignedBigInteger('product_id')->nullable();

            $table->string('stripe_price_id');
            $table->integer('quantity')->default(1);
            $table->integer('unit_amount'); // cents

            $table->timestamps();

            $table->index(['product_type', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_items');
    }
};
