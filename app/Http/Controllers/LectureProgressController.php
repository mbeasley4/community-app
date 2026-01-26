<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Lecture;
use Illuminate\Http\Request;

class LectureProgressController extends Controller
{
    public function save(Request $request, Lecture $lecture)
    {
        $request->validate([
            'watched_seconds' => ['required', 'integer', 'min:0'],
        ]);

        $user = $request->user();

        $seconds  = (int) $request->watched_seconds;
        $duration = (int) $lecture->duration_seconds;

        // Mark completed if within last 5 seconds
        $completed = $duration > 0 && $seconds >= ($duration - 5);

        $user->lectures()->syncWithoutDetaching([
            $lecture->id => [
                'watched_seconds' => $seconds,
                'completed_at'    => $completed ? now() : null,
            ],
        ]);

        return response()->json([
            'success'   => true,
            'completed'=> $completed,
        ]);
    }

    // Manual fallback button remains unchanged
    public function complete(Request $request, Lecture $lecture)
    {
        $user = $request->user();

        $user->lectures()->syncWithoutDetaching([
            $lecture->id => [
                'watched_seconds' => $lecture->duration_seconds ?? 0,
                'completed_at'    => now(),
            ],
        ]);

        return response()->json(['success' => true]);
    }
}
