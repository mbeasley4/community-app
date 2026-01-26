<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\User;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PurchaseSeeder extends Seeder
{
    public function run(): void
    {
        // Only seed if users exist
        $users = User::whereBetween('id', [1, 12])->get();

        if ($users->isEmpty()) {
            $this->command->warn('No users found in ID range 1–12. Skipping purchase seeding.');
            return;
        }

        foreach ($users as $user) {

            // Each user gets 1–3 purchases
            $purchaseCount = rand(1, 3);

            for ($i = 0; $i < $purchaseCount; $i++) {

                $purchase = Purchase::create([
                    'user_id'                   => $user->id,
                    'stripe_session_id'         => 'cs_test_' . Str::random(24),
                    'stripe_payment_intent_id'  => 'pi_test_' . Str::random(24),
                    'stripe_customer_id'        => 'cus_test_' . Str::random(14),
                    'amount'                    => rand(4900, 19900),
                    'currency'                  => 'usd',
                    'status'                    => 'paid',
                    'purchased_at'              => Carbon::now()->subDays(rand(1, 120)),
                ]);

                // Each purchase gets 1–2 items
                $itemCount = rand(1, 2);

                for ($j = 0; $j < $itemCount; $j++) {

                    PurchaseItem::create([
                        'purchase_id'     => $purchase->id,
                        'product_type'    => 'course',
                        'product_id'      => rand(1, 20), // fake internal course IDs
                        'stripe_price_id' => 'price_test_' . Str::random(10),
                        'quantity'        => 1,
                        'unit_amount'     => rand(4900, 9900),
                    ]);
                }
            }
        }

        $this->command->info('Purchase and PurchaseItem tables seeded.');
    }
}
