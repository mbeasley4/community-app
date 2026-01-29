<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'description',
        'price_cents',
        'stripe_price_id',
        'includes_cohort',
        'highlight',
    ];

    // Helper for display
    public function getPriceAttribute(): string
    {
        return '$' . number_format($this->price_cents / 100, 2);
    }
}
