<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PostImage extends Model
{
    protected $fillable = ['post_id', 'path'];

    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        return Storage::disk('public')->url($this->path);
    }
}

