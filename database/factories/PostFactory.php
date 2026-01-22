<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'body' => $this->faker->paragraphs(rand(1, 3), true),
            'created_at' => now()->subMinutes(rand(1, 10000)),
        ];
    }
}
