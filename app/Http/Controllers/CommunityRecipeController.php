<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CommunityRecipe;
use Illuminate\Support\Facades\Storage;
use App\Services\ImageModeration;
use App\Rules\NoProfanity;

class CommunityRecipeController extends Controller
{
    public function index()
    {
       return response()->json([
            'data' => CommunityRecipe::where('approved', true)
                ->with('user:id,name')  // eager load poster
                ->latest()
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        // ---- Validation ----
        $request->validate([
            'title'   => ['required', 'string', 'max:120', new NoProfanity],
            'excerpt' => ['required', 'string', 'max:500', new NoProfanity],
            'image'   => ['nullable', 'image', 'max:2048'], // 2MB
        ]);

        $imagePath = null;

        // ---- Image upload ----
        if ($request->hasFile('image')) {

            $path = $request->file('image')
                ->store('community-recipes', 'public');

            $absolutePath = storage_path('app/public/'.$path);

            if (! ImageModeration::imageIsSafe($absolutePath)) {
                Storage::disk('public')->delete($path);

                return response()->json([
                    'errors' => [
                        'image' => ['Image violates content guidelines.']
                    ]
                ], 422);
            }

            $imagePath = "/storage/".$path;
        }


        // ---- Save recipe (moderation queue) ----
        CommunityRecipe::create([
            'title'      => $request->title,
            'excerpt'    => $request->excerpt,
            'image_path' => $imagePath,
            'approved'   => false,
            'user_id'    => auth()->id(), // null if guest
        ]);


        return response()->json(['ok' => true]);
    }
}
