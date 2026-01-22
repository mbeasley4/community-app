<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class FeedSeeder extends Seeder
{
    public function run(): void
    {
        // Create users if none exist
        if (User::count() === 0) {
            User::factory()->count(10)->create();
        }

        Post::factory()->count(50)->create();
    }
}
