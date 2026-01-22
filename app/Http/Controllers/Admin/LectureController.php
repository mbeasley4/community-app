<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lecture;
use Illuminate\Http\Request;

class LectureController extends Controller
{
    public function index(Course $course)
    {
        return inertia('admin/lectures/index', [
            'course'   => $course,
            'lectures' => $course->lectures
        ]);
    }

    public function create(Course $course)
    {
        return inertia('admin/lectures/create', [
            'course' => $course
        ]);
    }

    public function store(Request $request, Course $course)
    {
        $data = $request->validate([
            'title'             => ['required','string'],
            'description'       => ['nullable','string'],
            'youtube_video_id'  => ['required','string'],
            'position'          => ['required','integer'],
            'image'             => ['nullable','image','max:2048'],
            'transcript'        => ['nullable','string'],
            'duration_seconds' => ['nullable','integer'],
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('lectures','public');
        }

        $course->lectures()->create($data);

        return redirect("/admin/courses/{$course->id}/lectures")
            ->with('success','Lecture created');
    }

    public function edit(Lecture $lecture)
    {
        return inertia('admin/lectures/edit', [
            'lecture' => $lecture,
            'course'  => $lecture->course
        ]);
    }

    public function update(Request $request, Lecture $lecture)
    {
        $data = $request->validate([
            'title'             => ['required','string'],
            'description'       => ['nullable','string'],
            'youtube_video_id'  => ['required','string'],
            'position'          => ['required','integer'],
            'image'             => ['nullable','image','max:2048'],
            'transcript'        => ['nullable','string'],
            'duration_seconds' => ['nullable','integer'],
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('lectures','public');
        }

        $lecture->update($data);

        return back()->with('success','Lecture updated');
    }

    public function destroy(Lecture $lecture)
    {
        $lecture->delete();
        return back();
    }
}
