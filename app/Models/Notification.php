<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id','title','body','url','read_at'
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];
}
