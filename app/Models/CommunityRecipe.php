<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommunityRecipe extends Model
{
    protected $fillable = [
        'title',
        'excerpt',
        'image_path',
        'approved'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

}