<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Stripe\Webhook;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $payload = $request->getContent();
        $sig = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sig, $secret);
        } catch (\Exception $e) {
            return response('Invalid signature', 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;

            $this->provisionUser($session);
        }

        return response('OK', 200);
    }

    protected function provisionUser(Session $session)
    {
        $email = $session->customer_details->email;
        $name = $session->customer_details->name ?? 'Fit30 Member';

        // Create user if not exists
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make(Str::random(32))
            ]
        );

        // Store purchase record (optional but recommended)
        $user->purchases()->create([
            'stripe_session_id' => $session->id,
            'price_id' => $session->line_items->data[0]->price->id ?? null,
            'amount' => $session->amount_total,
        ]);

        // Grant access flag
        $user->update([
            'has_active_cohort' => true
        ]);

        // Send magic login link email
        $user->sendLoginLink();
    }
}
