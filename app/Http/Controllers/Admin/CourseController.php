<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class CourseController extends Controller
{
    public function index()
    {
        return inertia('admin/courses/index', [
            'courses' => Course::orderBy('id')->get()->map(function ($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'description' => $course->description,
                    'image' => $course->image
                        ? asset('storage/' . $course->image)
                        : null,
                ];
            })
        ]);
    }


    public function create()
    {
        return inertia('admin/courses/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => ['required','string'],
            'description' => ['nullable','string'],
            'image'       => ['nullable','image','max:2048'],
        ]);

        $data['slug'] = Str::slug($data['title']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('courses','public');
        }

        Course::create($data);

        return redirect('/admin/courses')
            ->with('success','Course created');
    }

    public function edit(Course $course)
    {
        return inertia('admin/courses/edit', [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'description' => $course->description,
                'image' => $course->image
                    ? asset('storage/'.$course->image)
                    : null,
            ]
        ]);
    }


    public function update(Request $request, Course $course)
    {
        $data = $request->validate([
            'title'       => ['required','string'],
            'description' => ['nullable','string'],
            'image'       => ['nullable','image','max:2048'],
        ]);

        if ($request->hasFile('image')) {
            if ($course->image) {
                Storage::disk('public')->delete($course->image);
            }
            $data['image'] = $request->file('image')->store('courses','public');
        }
        $course->update($data);

        return back()->with('success','Course updated');
    }


    public function destroy(Course $course)
    {
        $course->delete();
        return back();
    }
}
