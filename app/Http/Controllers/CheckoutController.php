<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class CheckoutController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'price_id' => ['required', 'string'],
            'terms_accepted' => ['required', 'accepted'],
        ]);

        \Stripe\Stripe::setApiKey(config('services.stripe.secret'));

        $session = \Stripe\Checkout\Session::create([
            'mode' => 'payment',
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price' => $request->price_id,
                'quantity' => 1
            ]],
            'success_url' => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('checkout.cancel'),
        ]);

        // 👇 This fixes the Inertia error
        return redirect()->away($session->url);
    }

    public function success(Request $request)
    {
        return inertia('CheckoutSuccess');
    }

    public function cancel()
    {
        return inertia('CheckoutCancel');
    }
}