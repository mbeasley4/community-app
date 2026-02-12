<?php
use Illuminate\Support\Facades\Route;
use \App\Models\Product;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\RecipesController;
use App\Http\Controllers\YouTubeController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CommunityRecipeController;
use App\Http\Controllers\LectureProgressController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\LiveStreamController; 


// Route::get('/youtube/playlist/{playlistId}', [YouTubeController::class, 'playlist']);
Route::get('/products', function () {
    return Product::all()->map(fn($p) => [
        'id' => $p->slug,
        'name' => $p->name,
        'description' => $p->description,
        'price' => $p->price,
        'priceId' => $p->stripe_price_id,
        'highlight' => (bool) $p->highlight,
    ]);
});

 Route::prefix('livestream')->group(function () {
        Route::post('/token', [LiveStreamController::class, 'getToken']);
        Route::post('/room/create', [LiveStreamController::class, 'createRoom']);
        Route::post('/room/join', [LiveStreamController::class, 'joinRoom']);
    });
Route::get('/livestream/test-credentials', function () {
    $service = app(\App\Services\ZegoCloudService::class); 
    return response()->json($service->validateCredentials());
});

Route::middleware('auth')->group(function () {
   Route::get('/courses', [CourseController::class, 'index']);
    
    Route::get('/courses/{course}', [CourseController::class, 'show']);
    
    Route::post('/lectures/{lecture}/progress', [LectureProgressController::class, 'save']);
    Route::post('/lectures/{lecture}/complete', [LectureProgressController::class, 'complete']);
    // Get all events for FullCalendar (FullCalendar expects a JSON feed)
    Route::get('/events', [EventsController::class, 'index']);

    // Create a new event
    Route::post('/events', [EventsController::class, 'store']);

    // Update an event (FullCalendar can trigger this with eventDrop or similar interactions)
    Route::put('/events/{event}', [EventsController::class, 'update']);

    // Delete an event
    Route::delete('/events/{event}', [EventsController::class, 'destroy']);
    /* Recipes */
    Route::get('/recipes', [RecipesController::class, 'index']);
    
    Route::get('/community-recipes', [CommunityRecipeController::class, 'index']);
    Route::post('/community-recipes', [CommunityRecipeController::class, 'store']);
    Route::get('/community-recipes/{recipe}', [CommunityRecipeController::class, 'show']);
    
    /* Videos */
    Route::get('/videos', [VideoController::class, 'index']);
    
    /* POSTS */
    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::post('/posts/{post}/hide', [PostController::class, 'hide']);
    Route::post('/posts/{post}/react', [PostController::class, 'toggle']); 
    Route::post('/posts/{post}/comments', [PostController::class, 'comment']);
    Route::delete('/comments/{comment}', [PostController::class, 'hideComment']);

});