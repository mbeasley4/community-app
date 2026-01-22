<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use ConsoleTVs\Profanity\Facades\Profanity;

class NoProfanity implements Rule
{
    public function passes($attribute, $value)
    {
        return Profanity::blocker($value)->clean();
    }

    public function message()
    {
        return 'Your post contains unacceptable language.';
    }
}
