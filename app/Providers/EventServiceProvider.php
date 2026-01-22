<?php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
   protected $listen = [
        Login::class => [
            UpdateLastLoginAt::class,
        ],
    ];
}
