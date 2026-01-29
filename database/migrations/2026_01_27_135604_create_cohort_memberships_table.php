<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cohort_memberships', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->timestamp('joined_at');
            $table->timestamps();

            // Ensure a user can only belong to one cohort membership
            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cohort_memberships');
    }
};
