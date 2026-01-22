<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function show(Course $course)
    {
        $course->load([
            'lectures' => fn ($q) => $q->orderBy('position'),
            'lectures.users' => fn ($q) => $q->where('users.id', auth()->id()),
        ]);

        $previousCompleted = true; // 👈 Initialize first lecture as unlocked

        $lectures = $course->lectures->map(function ($lecture) use (&$previousCompleted) {

            $completed = $lecture->users->isNotEmpty();

            // Lecture is unlocked only if previous one completed
            $unlocked = $previousCompleted;

            // Set up for next iteration
            $previousCompleted = $completed;

            return [
                'id' => $lecture->id,
                'title' => $lecture->title,
                'youtube_video_id' => $lecture->youtube_video_id, 
                'transcript' => $lecture->transcript,
                'image' => $lecture->image,
                'position' => $lecture->position,
                'completed' => $completed,
                'unlocked' => $unlocked,
            ];
        });

        return response()->json([
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'description' => $course->description,
                'image' => $course->image,
            ],
            'lectures' => $lectures,
        ]);
    }

}
