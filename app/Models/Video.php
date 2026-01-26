<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = [
        'youtube_video_id',
        'title',
        'description',
        'thumbnail',
        'sort_order',
    ];

    protected static function booted()
    {
        static::addGlobalScope('ordered', function ($query) {
            $query->orderBy('sort_order');
        });
    }
}


