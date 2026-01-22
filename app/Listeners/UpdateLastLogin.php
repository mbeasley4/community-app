<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateLastLogin
{
    public function handle(Login $event): void
    {
        $event->user->forceFill([
            'last_login_at' => now(),
        ])->save();
    }
}