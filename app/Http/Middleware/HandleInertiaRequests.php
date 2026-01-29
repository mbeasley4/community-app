<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),

            'name' => config('app.name'),

            'quote' => [
                'message' => trim($message),
                'author' => trim($author)
            ],
            'ads' => fn () => \App\Models\Advertisement::where('is_active', true)->get(),
            'auth' => [
                'user' => fn () => $request->user()
                    ? array_merge(
                        $request->user()
                            ->load([
                                'purchasedCourses:id,slug,title',
                                'cohort'
                            ])
                            ->loadCount([
                                'visiblePosts as posts_count' => fn ($q) => $q->where('hidden', false),
                                'recipes'
                            ])
                            ->only([
                                'id',
                                'name',
                                'email',
                                'avatar',
                                'avatar_url',
                                'email_verified_at',
                                'created_at',
                                'updated_at',
                                'posts_count',
                                'recipes_count',
                            ]),
                        [
                            'roles' => $request->user()->getRoleNames(),
                            'purchased_courses' => $request->user()
                                ->purchasedCourses
                                ->map(fn ($c) => [
                                    'id' => $c->id,
                                    'slug' => $c->slug,
                                    'title' => $c->title,
                                ]),
                            'cohort' => $request->user()->cohort,
                        ]
                    )
                    : null,
            'notificationCount' => fn () =>
                $request->user()
                    ? $request->user()
                        ->unreadNotificationsSinceLastLogin()
                        ->count()
                    : 0,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],

            'sidebarOpen' =>
                ! $request->hasCookie('sidebar_state')
                || $request->cookie('sidebar_state') === 'true',
        ];
    }

}
