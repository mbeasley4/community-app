<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function index()
    {
        return inertia('admin/videos/index', [
            'videos' => Video::orderBy('sort_order')->get()->map(function ($video) {
                return [
                    'id' => $video->id,
                    'title' => $video->title,
                    'youtube_video_id' => $video->youtube_video_id,
                    'description' => $video->description,
                ];
            })
        ]);
    }

    public function create()
    {
        return inertia('admin/videos/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required','string'],
            'youtube_video_id' => ['required','string'],
            'description' => ['nullable','string'],
        ]);

        $data['sort_order'] = Video::max('sort_order') + 1;

        Video::create($data);

        return redirect('/admin/videos')
            ->with('success', 'Video created');
    }

    public function edit(Video $video)
    {
        return inertia('admin/videos/edit', [
            'video' => [
                'id' => $video->id,
                'title' => $video->title,
                'youtube_video_id' => $video->youtube_video_id,
                'description' => $video->description,
            ]
        ]);
    }

    public function update(Request $request, Video $video)
    {
        $data = $request->validate([
            'title' => ['required','string'],
            'youtube_video_id' => ['required','string'],
            'description' => ['nullable','string'],
        ]);

        $video->update($data);

        return back()->with('success', 'Video updated');
    }

    public function destroy(Video $video)
    {
        $video->delete();
        return back();
    }
}

