<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'body', 'images','hidden'];
    protected $casts = [
        'reaction_summary' => 'array',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reactions()
    {
        return $this->hasMany(PostReaction::class);
    }

    // app/Models/Post.php
    public function comments()
    {
        return $this->hasMany(PostComment::class)
            ->where('hidden', false)
            ->latest();
    }

    public function commentsCount()
    {
        return $this->hasMany(PostComment::class)
            ->where('hidden', false);
    }

    public function images()
    {
        return $this->hasMany(PostImage::class);
    }

}
