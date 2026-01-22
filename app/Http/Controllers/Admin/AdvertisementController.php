<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use Illuminate\Http\Request;

class AdvertisementController extends Controller
{
    public function index()
    {
        return inertia('admin/ads/index', [
            'ads' => Advertisement::orderBy('position')->get()
        ]);
    }

    public function create()
    {
        return inertia('admin/ads/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['nullable','string'],
            'link_url' => ['nullable','url'],
            'position' => ['required','integer'],
            'image' => ['required','image','max:2048'],
            'is_active' => ['boolean']
        ]);

        $path = $request->file('image')->store('ads', 'public');

        Advertisement::create([
            'title' => $data['title'],
            'link_url' => $data['link_url'],
            'position' => $data['position'],
            'is_active' => $data['is_active'] ?? true,
            'image_path' => $path,
        ]);

        return redirect('/admin/ads');
    }

    public function edit(Advertisement $advertisement)
    {
        return inertia('admin/ads/edit', [
            'ad' => $advertisement
        ]);
    }

    public function update(Request $request, Advertisement $advertisement)
    {
        $data = $request->validate([
            'title' => ['nullable','string'],
            'link_url' => ['nullable','url'],
            'position' => ['required','integer'],
            'image' => ['nullable','image','max:2048'],
            'is_active' => ['boolean']
        ]);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('ads','public');
        }

        $advertisement->update($data);

        return redirect('/admin/ads');
    }

    public function destroy(Advertisement $advertisement)
    {
        $advertisement->delete();
        return back();
    }
}