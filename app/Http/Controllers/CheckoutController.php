<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Stripe;

class CheckoutController extends Controller
{
    public function show(Request $request)
    {
        $slug = $request->query('product');

        $product = Product::where('slug', $slug)->firstOrFail();

        return inertia('checkout', [
            'product' => [
                'slug' => $product->slug,
                'name' => $product->name,
                'price' => '$' . number_format(((int) $product->price_cents) / 100, 2),
            ],
        ]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'price_id' => ['required', 'string'],
            'terms_accepted' => ['required', 'accepted'],
        ]);

        Stripe::setApiKey(config('services.stripe.secret'));

        $session = StripeSession::create([
            'mode' => 'payment',
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price' => $request->price_id,
                'quantity' => 1,
            ]],
            'success_url' => route('checkout.success').'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('checkout.cancel'),
        ]);

        return redirect()->away($session->url);
    }

    public function success(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $sessionId = $request->get('session_id');
        if (! $sessionId) {
            return inertia('checkout-cancel');
        }

        $session = StripeSession::retrieve([
            'id' => $sessionId,
            'expand' => ['line_items.data.price'],
        ]);

        if ($session->payment_status !== 'paid') {
            return inertia('checkout-cancel');
        }

        $priceId = $session->line_items->data[0]->price->id ?? null;
        if (! $priceId) {
            Log::error('Stripe session missing price_id');

            return inertia('checkout-cancel');
        }

        $email = $session->customer_details->email ?? null;
        if (! $email) {
            Log::error('Stripe session missing customer email');

            return inertia('checkout-cancel');
        }

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $email,
                'password' => Hash::make(Str::random(16)),
            ]
        );

        // Grant access immediately
        $this->grantEntitlements($user, $priceId);

        // Existing user → log in and go home
        if (! $user->wasRecentlyCreated) {
            Auth::login($user);

            return redirect()->route('home');
        }

        // New user → create registration completion token
        $token = Str::random(60);

        $user->update([
            'registration_token' => hash('sha256', $token),
        ]);

        return redirect()->route('registration.complete.form', [
            'token' => $token,
        ]);
    }

    public function cancel()
    {
        return inertia('checkout-cancel');
    }

    /**
     * Assign courses and cohort membership after successful payment
     */
    protected function grantEntitlements(User $user, string $priceId): void
    {
        $product = Product::where('stripe_price_id', $priceId)->first();

        if (! $product) {
            Log::error("Unknown Stripe price_id: {$priceId}");

            return;
        }

        // Assign base member role on first purchase
        if (! $user->hasRole('member')) {
            $user->assignRole('member');
        }

        // Courses linked by slug
        foreach ($product->slug === 'foundation' ? ['fit30-foundations'] :
                ($product->slug === 'reintro' ? ['reintroduction'] :
                ($product->slug === 'bundle' ? ['fit30-foundations'] : [])) as $courseSlug) {

            $course = Course::where('slug', $courseSlug)->first();
            if ($course) {
                $user->purchasedCourses()->syncWithoutDetaching([
                    $course->id => ['purchased_at' => now()],
                ]);
            }
        }

        // Cohort
        if ($product->includes_cohort && ! $user->cohort) {
            $user->cohort()->create(['joined_at' => now()]);
        }
    }
}
