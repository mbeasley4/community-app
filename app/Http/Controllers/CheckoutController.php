<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;

class CheckoutController extends Controller
{
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
                'quantity' => 1
            ]],
            'success_url' => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
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


        // Ensure payment completed
        if ($session->payment_status !== 'paid') {
            return inertia('checkout-cancel');
        }

        // Get purchased price_id
        $priceId = $session->line_items->data[0]->price->id ?? null;

        if (! $priceId) {
            Log::error('Stripe session missing price_id');
            return inertia('checkout-cancel');
        }

        // Grant access
        $this->grantEntitlements($request->user(), $priceId);

        return inertia('checkout-success');
    }

    public function cancel()
    {
        return inertia('checkout-cancel');
    }

    /**
     * Assign roles and purchased courses after successful payment
     */
    protected function grantEntitlements($user, string $priceId): void
    {
        $product = config("products.$priceId");

        if (! $product) {
            Log::error("Unknown Stripe price_id: {$priceId}");
            return;
        }

        // Assign role if defined
        if (! empty($product['role'])) {
            $user->assignRole($product['role']);
        }

        // Attach purchased courses
        foreach ($product['courses'] as $courseSlug) {
            $course = Course::where('slug', $courseSlug)->first();

            if ($course) {
                $user->purchasedCourses()->syncWithoutDetaching([
                    $course->id => ['purchased_at' => now()]
                ]);
            }
        }
    }
}
