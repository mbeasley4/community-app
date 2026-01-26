<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('community_recipes', function (Blueprint $table) {
            $table->json('ingredients')->nullable();
            $table->json('instructions')->nullable();
            $table->string('image_path')->nullable()->change(); 
        });
    }

    public function down(): void
    {
        Schema::table('community_recipes', function (Blueprint $table) {
            $table->dropColumn(['ingredients', 'instructions']);
        });
    }
};
