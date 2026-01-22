<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Models\Course;
use App\Models\Advertisement;

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\AdvertisementController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\LectureController;

Route::get('/', function () {
    return Inertia::render('home', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

/*
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('community', function () {
        return Inertia::render('community', [
        'ads' => Advertisement::where('is_active', true)
                    ->orderBy('position')
                    ->get()
    ]);
    })->name('community');

    Route::get('/recipes', function () {
        return Inertia::render('recipes');
    })->name('recipes');

    Route::get('/events', function () {
        return Inertia::render('events', [
        'ads' => Advertisement::where('is_active', true)
                    ->orderBy('position')
                    ->get()
    ]);
    })->name('events');

    Route::get('/videos', function () {
        return Inertia::render('videos');
    })->name('videos');

    Route::get('/courses', function () {
        return Inertia::render('courses', [
        'ads' => Advertisement::where('is_active', true)
                    ->orderBy('position')
                    ->get()
    ]);
    })->name('courses');
    
    Route::get('/courses/{course}', function (Course $course) {
        return Inertia::render('course-show', [
            'courseId' => $course->id,
        ]);
    })->name('courses.show');
});

Route::get('/img', function (\Illuminate\Http\Request $request) {
    $url = $request->query('url');

    abort_unless(
        str_starts_with($url, 'https://whole30.com/wp-content/uploads/'),
        403
    );

    $response = \Illuminate\Support\Facades\Http::withHeaders([
        'User-Agent' => 'Mozilla/5.0',
        'Referer' => 'https://whole30.com',
    ])->get($url);

    if ($response->failed()) {
        abort(404);
    }

    return response($response->body(), 200)
        ->header('Content-Type', $response->header('Content-Type'))
        ->header('Cache-Control', 'public, max-age=86400');
});

Route::post('/checkout', [CheckoutController::class, 'create'])->name('checkout.create');

Route::get('/checkout/success', [CheckoutController::class, 'success'])
    ->name('checkout.success');

Route::get('/checkout/cancel', [CheckoutController::class, 'cancel'])
    ->name('checkout.cancel');


/**
 * ADMIN ROUTES 
 */
// routes/web.php

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->group(function () {
    
    // ---- Users ----
    Route::get('/users', [UserManagementController::class, 'index'])
        ->name('admin.users');
    Route::get('/users/{user}/edit', [UserManagementController::class, 'edit'])
        ->name('admin.users.edit');
    Route::put('/users/{user}', [UserManagementController::class, 'update']);
    Route::put('/users/{user}/password', [UserManagementController::class, 'updatePassword']);
    
    // ---- Ads ----
    Route::get('/ads', [AdvertisementController::class, 'index']);
    Route::get('/ads/create', [AdvertisementController::class, 'create']);
    Route::post('/ads', [AdvertisementController::class, 'store']);
    Route::get('/ads/{advertisement}/edit', [AdvertisementController::class, 'edit']);
    Route::put('/ads/{advertisement}', [AdvertisementController::class, 'update']);
    Route::delete('/ads/{advertisement}', [AdvertisementController::class, 'destroy']);

     // ---- Courses ----
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/create', [CourseController::class, 'create']);
    Route::post('/courses', [CourseController::class, 'store']);
    Route::get('/courses/{course}/edit', [CourseController::class, 'edit']);
    Route::put('/courses/{course}', [CourseController::class, 'update']);
    Route::delete('/courses/{course}', [CourseController::class, 'destroy']);

    // ---- Lectures ----
    Route::get('/courses/{course}/lectures', [LectureController::class, 'index']);
    Route::get('/courses/{course}/lectures/create', [LectureController::class, 'create']);
    Route::post('/courses/{course}/lectures', [LectureController::class, 'store']);

    Route::get('/lectures/{lecture}/edit', [LectureController::class, 'edit']);
    Route::put('/lectures/{lecture}', [LectureController::class, 'update']);
    Route::delete('/lectures/{lecture}', [LectureController::class, 'destroy']);
});

require __DIR__.'/settings.php';
