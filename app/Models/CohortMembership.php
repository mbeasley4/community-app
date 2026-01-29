<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CohortMembership extends Model
{
    protected $fillable = ['user_id', 'joined_at'];
}
