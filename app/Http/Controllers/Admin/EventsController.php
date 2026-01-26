<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia; // ← THIS LINE FIXES THE ERROR

class EventsController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/events/index', [
            'events' => Event::latest()->paginate(10)
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/events/create');
    }

    public function store(Request $request)
    {
        Event::create(
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'start_at' => 'required|date',
                'end_at' => 'nullable|date|after_or_equal:start_at',
                'event_url' => 'nullable|url',
                'badge' => 'nullable|string|max:50',
                'status' => 'required|in:draft,published,cancelled',
            ])
        );

        return redirect('/admin/events')->with('success', 'Event created');
    }

    public function edit(Event $event)
    {
        return Inertia::render('admin/events/edit', [
            'event' => $event
        ]);
    }

    public function update(Request $request, Event $event)
    {
        $event->update(
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'start_at' => 'required|date',
                'end_at' => 'nullable|date|after_or_equal:start_at',
                'event_url' => 'nullable|url',
                'badge' => 'nullable|string|max:50',
                'status' => 'required|in:draft,published,cancelled',
            ])
        );

        return redirect('/admin/events')->with('success', 'Event updated');
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return back()->with('success', 'Event deleted');
    }
}
