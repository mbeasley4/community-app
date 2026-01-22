<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PostCreated implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public function __construct(public array $post) {}

    public function broadcastOn(): Channel
    {
        return new Channel('feed');
    }

    public function broadcastAs(): string
    {
        return 'PostCreated';
    }
}
