<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{

    public function index()
    {
        $courses = Course::all()->map(function ($course) {
            return [
                'id' => $course->id,
                'title' => $course->title,
                'description' => $course->description,
                'image' => $course->image
                    ? asset('storage/' . $course->image)
                    : null,
            ];
        });

        return response()->json($courses);
    }
    public function show(Course $course)
    {
        $course->load([
            'lectures' => fn ($q) => $q->orderBy('position'),
            'lectures.users' => fn ($q) => $q->where('users.id', auth()->id()),
        ]);

        $previousCompleted = true;
        $foundCurrent = false;
        
        $lectures = $course->lectures->map(function ($lecture) use (&$previousCompleted, &$foundCurrent) {

        // Get pivot row if exists
        $pivot = $lecture->users->first()?->pivot;

        $completed = $pivot && $pivot->completed_at !== null;

        $unlocked = $previousCompleted;

        // NEW: mark first unlocked & not completed as in_progress
        $inProgress = false;
        if (!$foundCurrent && $unlocked && !$completed) {
            $inProgress = true;
            $foundCurrent = true;
        }

        $previousCompleted = $completed;

            return [
                'id' => $lecture->id,
                'title' => $lecture->title,
                'youtube_video_id' => $lecture->youtube_video_id,
                'transcript' => $lecture->transcript,
                'image' => $lecture->image
                    ? asset('storage/' . $lecture->image)
                    : null,
                'position' => $lecture->position,
                'duration_seconds' => $lecture->duration_seconds,

                'completed'   => $completed,
                'in_progress'=> $inProgress,
                'unlocked'   => $unlocked,
            ];
        });

        return response()->json([
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'description' => $course->description,
                'image' => $course->image
                    ? asset('storage/' . $course->image)
                    : null,
            ],
            'lectures' => $lectures,
        ]);
    }

}
