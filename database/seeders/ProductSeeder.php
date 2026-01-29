<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::updateOrCreate(
            ['stripe_price_id' => 'price_1SrJunPAqkOdrASefkMapB4h'],
            [
                'slug' => 'cohort',
                'name' => 'Fit30 Cohort',
                'description' => 'Guided 30-day program with live group accountability',
                'price_cents' => 32500,
                'includes_cohort' => true,
            ]
        );

        Product::updateOrCreate(
            ['stripe_price_id' => 'price_1SrJu4PAqkOdrASegZWwohfD'],
            [
                'slug' => 'foundation',
                'name' => 'Foundation Courses',
                'description' => 'Self-paced Fit30 education & habit training',
                'price_cents' => 25000,
            ]
        );

        Product::updateOrCreate(
            ['stripe_price_id' => 'price_1SrJspPAqkOdrASebd3vsg1u'],
            [
                'slug' => 'bundle',
                'name' => 'Cohort + Foundations',
                'description' => 'Complete experience — best value',
                'price_cents' => 40000,
                'includes_cohort' => true,
                'highlight' => true,
            ]
        );

        Product::updateOrCreate(
            ['stripe_price_id' => 'price_1SuDllPAqkOdrASehxW3Qbuf'],
            [
                'slug' => 'reintro',
                'name' => 'Reintroduction Courses',
                'description' => 'Self-paced Fit30 education & reintroduction to Food Freedom.',
                'price_cents' => 15000,
            ]
        );
    }
}
