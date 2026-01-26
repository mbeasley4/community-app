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
        $recipes = CommunityRecipe::where('status', 'approved')
            ->with('user:id,name,avatar')
            ->latest()
            ->paginate(12);

        // Transform each item but keep pagination structure
        $recipes->getCollection()->transform(function ($recipe) {
            return [
                'id' => $recipe->id,
                'title' => $recipe->title,
                'excerpt' => $recipe->excerpt,
                'ingredients' => $recipe->ingredients ?? [],
                'instructions' => $recipe->instructions ?? [],
                'image' => $recipe->image_path
                    ? asset('storage/' . $recipe->image_path)
                    : null,
                'user' => [
                    'id' => $recipe->user->id,
                    'name' => $recipe->user->name,
                    'avatar' => $recipe->user->avatar
                        ? asset('storage/' . $recipe->user->avatar)
                        : null
                ],
                'created_at' => $recipe->created_at->toDateTimeString()
            ];
        });

        return response()->json($recipes);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'        => ['required','string','max:255'],
            'excerpt'      => ['required','string','max:1000'],
            'ingredients'  => ['nullable'],
            'instructions'=> ['nullable'],
            'image'        => ['nullable','image','max:2048'],
        ]);

        $path = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')
                ->store('community/recipes', 'public');
        }

        CommunityRecipe::create([
            'user_id'      => auth()->id(),
            'title'        => $data['title'],
            'excerpt'      => $data['excerpt'],
            'ingredients'  => json_decode($data['ingredients'] ?? '[]', true),
            'instructions'=> json_decode($data['instructions'] ?? '[]', true),
            'image_path'   => $path,
            'status'       => 'pending'
        ]);

        return response()->json(['success' => true]);
    }

    public function show(CommunityRecipe $recipe)
    {
        // Only allow approved recipes to be viewed
        abort_unless($recipe->status === 'approved', 404);

        $recipe->load('user:id,name,avatar');

        return response()->json([
            'id' => $recipe->id,
            'title' => $recipe->title,
            'excerpt' => $recipe->excerpt,
            'ingredients' => $recipe->ingredients ?? [],
            'instructions' => $recipe->instructions ?? [],
            'image' => $recipe->image_path
                ? asset('storage/' . $recipe->image_path)
                : null,
            'user' => [
                'id' => $recipe->user->id,
                'name' => $recipe->user->name,
                'avatar' => $recipe->user->avatar
                    ? asset('storage/' . $recipe->user->avatar)
                    : null
            ],
            'created_at' => $recipe->created_at->toDateTimeString()
        ]);
    }


}
