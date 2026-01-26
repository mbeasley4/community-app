<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = [
        'user_id',
        'stripe_session_id',
        'stripe_payment_intent_id',
        'stripe_customer_id',
        'amount',
        'currency',
        'status',
        'purchased_at',
    ];

    protected $casts = [
        'purchased_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(PurchaseItem::class);
    }
}
