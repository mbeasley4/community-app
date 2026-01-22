<?php

// app/Models/PostComment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostComment extends Model
{
    protected $fillable = [
        'post_id',
        'user_id',
        'body',
        'hidden'
    ];

    public function user()
    {
        return $this->belongsTo(User::class)
            ->select(['id','name']);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}