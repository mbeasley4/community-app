<?php

namespace App\Http\Controllers\Api;

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

        $user->lectures()->syncWithoutDetaching([
            $lecture->id => [
                'watched_seconds' => $request->watched_seconds,
                // do NOT set completed_at here automatically
            ],
        ]);

        return response()->json(['success' => true]);
    }

    public function complete(Request $request, Lecture $lecture)
    {
        $user = $request->user();

        $user->lectures()->syncWithoutDetaching([
            $lecture->id => [
                'completed_at' => now(),
            ],
        ]);

        return response()->json(['success' => true]);
    }
}
