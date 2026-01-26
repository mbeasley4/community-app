<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class CommunityRecipe extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'excerpt',
        'ingredients',
        'instructions',
        'image_path',
        'status'
    ];

    protected $casts = [
        'ingredients'  => 'array',
        'instructions' => 'array',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image_path
            ? Storage::disk('public')->url($this->image_path)
            : null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
