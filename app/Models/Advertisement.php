<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Advertisement extends Model
{
    protected $fillable = [
        'title',
        'image_path',
        'link_url',
        'position',
        'is_active'
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return Storage::disk('public')->url($this->image_path);
    }
}

