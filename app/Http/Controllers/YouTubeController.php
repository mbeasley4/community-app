<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;

class YouTubeController extends Controller
{
    public function playlist(string $playlistId)
    {
        $response = Http::timeout(15)->get(
            'https://www.googleapis.com/youtube/v3/playlistItems',
            [
                'part' => 'snippet,contentDetails',
                'playlistId' => $playlistId,
                'maxResults' => 50,
                'key' => config('services.youtube.key'),
            ]
        );

        if ($response->failed()) {
            return response()->json([
                'message' => 'Unable to fetch playlist',
            ], 502);
        }

        return response()->json($response->json());
    }
}
