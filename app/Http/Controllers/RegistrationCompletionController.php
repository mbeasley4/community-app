<?php

namespace App\Http\Controllers;
 
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class RegistrationCompletionController extends Controller
{
    public function show(Request $request)
    {
        return inertia('auth/complete-registration', [
            'token' => $request->token,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'token' => ['required'],
            'name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $hashed = hash('sha256', $request->token);

        $user = User::where('registration_token', $hashed)->first();
        $path = null;

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')
                ->store('avatars', 'public');
        }

        $user->update([
            'name' => $request->name,
            'password' => Hash::make($request->password),
            'registration_token' => null,
            'email_verified_at' => now(),
            'avatar' => $path,
        ]);

        Auth::login($user);

        return redirect()->route('home');
    }
}
