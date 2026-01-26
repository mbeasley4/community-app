<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommunityRecipe;
use Illuminate\Http\Request;

class RecipeModerationController extends Controller
{
    public function index()
    {
        return inertia('admin/recipes/index', [
            'recipes' => CommunityRecipe::with('user:id,name')
                ->latest()
                ->paginate(20)
        ]);
    }

    public function show(CommunityRecipe $recipe)
    {
        return inertia('admin/recipes/show', [
            'recipe' => $recipe->load('user:id,name')
        ]);
    }

    public function approve(CommunityRecipe $recipe)
    {
        $recipe->update(['status' => 'approved']);
        return back()->with('success', 'Recipe approved');
    }

    public function reject(CommunityRecipe $recipe)
    {
        $recipe->update(['status' => 'rejected']);
        return back()->with('success', 'Recipe rejected');
    }

    public function destroy(CommunityRecipe $recipe)
    {
        $recipe->delete();
        return back()->with('success', 'Recipe deleted');
    }
}

