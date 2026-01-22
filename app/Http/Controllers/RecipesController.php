<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class RecipesController extends Controller
{
    public function index(Request $request)
    {        
        $page = $request->integer('page', 1);
        $data = Cache::remember("wp_recipes_page_{$page}", 3600, function () use ($page) {
            $response = Http::timeout(15)->get(
                'https://whole30.com/wp-json/wp/v2/recipes',
                [
                    'per_page' => 10,
                    'page' => $page,
                    '_embed' => true,
                ]
            );

            if ($response->failed()) {
                abort(502, 'Failed to fetch recipes');
            }

            return [
                'data' => $response->json(),
                'pagination' => [
                    'page' => $page,
                    'total' => (int) $response->header('X-WP-Total'),
                    'pages' => (int) $response->header('X-WP-TotalPages'),
                ],
            ];
        });

        return response()->json($data);
    }
}
