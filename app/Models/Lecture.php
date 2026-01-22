<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lecture extends Model
{
    protected $fillable = [
        'course_id',
        'title',
        'description',
        'youtube_video_id',
        'image',
        'position',
        'transcript',
        'duration_seconds',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('watched_seconds', 'completed_at')
            ->withTimestamps();
    }
}

