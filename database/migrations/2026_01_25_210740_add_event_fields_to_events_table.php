<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {

            $table->string('event_url')->nullable()->after('end_at');
            $table->string('badge')->nullable()->after('event_url');

            $table->enum('status', ['draft', 'published', 'cancelled'])
                  ->default('draft')
                  ->after('badge');

            $table->string('timezone')
                  ->default(config('app.timezone'))
                  ->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn([
                'event_url',
                'badge',
                'status',
                'timezone'
            ]);
        });
    }
};