<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('lectures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();

            $table->string('youtube_video_id');
            $table->string('image')->nullable();
            $table->unsignedInteger('position')->default(1);

            $table->longText('transcript')->nullable();

            // optional metadata
            $table->unsignedInteger('duration_seconds')->nullable();

            $table->timestamps();

            $table->unique(['course_id', 'position']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('lectures');
    }
};
