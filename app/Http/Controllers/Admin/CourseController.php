<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        return inertia('admin/courses/index', [
            'courses' => Course::orderBy('id')->get()
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
            'course' => $course
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
