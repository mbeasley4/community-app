<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use App\Models\PostReaction;
use App\Models\PostComment;
use App\Rules\NoProfanity;


class PostController extends Controller
{
    public function index()
    {
        return Post::query()
            ->with([
                'user:id,name,avatar',
                'comments.user:id,name,avatar'
            ])
            ->withCount('comments as comments_count')
            ->select('*')
            ->selectSub(function ($q) {
                $q->from(function ($sub) {
                    $sub->from('post_reactions')
                        ->selectRaw('type, COUNT(*) as count')
                        ->whereColumn('post_reactions.post_id', 'posts.id')
                        ->groupBy('type');
                }, 'reaction_counts')
                ->selectRaw("COALESCE(JSON_OBJECTAGG(type, count), '{}')");
            }, 'reaction_summary')
            ->latest()
            ->paginate(10);

    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'body' => ['required', 'string', 'max:5000', new NoProfanity],
        ]);


        $post = Post::create([
            'user_id' => auth()->id(), // assumes auth
            'body' => $data['body'],
        ]);

        return $post->load('user:id,name');
    }

    public function hide(Post $post)
    {
        if ($post->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post->update(['hidden' => true]);

        return response()->json(['success' => true]);
    }

    public function toggle(Request $request, Post $post)
    {
        $request->validate([
            'type' => 'required|string'
        ]);

        $user = $request->user();
        $type = $request->type;

        // Find existing reaction by this user on this post
        $existing = PostReaction::where('post_id', $post->id)
            ->where('user_id', $user->id)
            ->first();

        if (!$existing) {
            // No reaction yet → create one
            PostReaction::create([
                'post_id' => $post->id,
                'user_id' => $user->id,
                'type' => $type,
            ]);
        } 
        elseif ($existing->type === $type) {
            // Same reaction clicked again → remove
            $existing->delete();
        } 
        else {
            // Different reaction exists → update type
            $existing->update([
                'type' => $type
            ]);
        }

        // Recalculate summary
        $summary = $post->reactions()
            ->selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type');

        // return back()->with('reactionSummary', $summary);
        return response()->json([ 'reactionSummary' => $summary ]);
    }


    public function comment(Request $request, Post $post)
    {
        $data = $request->validate([
            'body' => ['required', 'string', 'max:2000', new NoProfanity],
        ]);

        $comment = PostComment::create([
            'post_id' => $post->id,
            'user_id' => auth()->id(),
            'body' => $data['body']
        ]);

        return $comment->load('user:id,name');
    }

    public function hideComment(PostComment $comment)
    {
        if ($comment->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->update(['hidden' => true]);

        return response()->json(['success' => true]);
    }


}
