<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Carbon\Carbon;

class EventsController extends Controller
{
    public function index() 
    {
        $now = Carbon::now();
        
        /* =========================
           Upcoming / Current
        ========================= */

        $upcoming = Event::where(function ($query) use ($now) {
            // Future events
            $query->where('start_at', '>=', $now)

                // Currently running (must have an end)
                ->orWhere(function ($q) use ($now) {
                    $q->whereNotNull('end_at')
                      ->where('start_at', '<=', $now)
                      ->where('end_at', '>=', $now);
                }); 
        })
        ->orderBy('start_at')  
        ->get()
        ->map(fn ($event) => [
            'id' => $event->id,
            'title' => $event->title,
            'start_at' => $event->start_at,
            'end_at' => $event->end_at,
            'allDay' => (bool) $event->all_day,
            'description' => $event->description,
            
        ]);

        /* =========================
           Past
        ========================= */

        $past = Event::where(function ($query) use ($now) {
            // Events with an end that already passed
            $query->whereNotNull('end_at')
                  ->where('end_at', '<', $now)

                // OR single-point events that already passed
                ->orWhere(function ($q) use ($now) {
                    $q->whereNull('end_at')
                      ->where('start_at', '<', $now);
                });
        })
        ->orderByDesc('start_at')
        ->get()
        ->map(fn ($event) => [
            'id' => $event->id,
            'title' => $event->title,
            'start_at' => $event->start_at,
            'end_at' => $event->end_at,
            'allDay' => (bool) $event->all_day,
            'description' => $event->description,
        ]);

        return response()->json([
            'upcoming' => $upcoming,
            'past' => $past,
        ]);
    }
}
