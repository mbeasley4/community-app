<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserManagementController extends Controller
{
    public function index()
    {
        return inertia('admin/users/index', [
            'users' => User::with('roles')->paginate(20),
        ]);
    }

    public function edit(User $user)
    {
        return inertia('admin/users/edit', [
            'user'  => $user->load('roles'),
            'roles' => Role::pluck('name'),
        ]);
    }
    /**
     * Update user profile + role
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name'  => ['required', 'string'],
            'email' => ['required', 'email'],
            'role'  => ['required', 'string', 'exists:roles,name'],
        ]);

        $user->update([
            'name'  => $request->name,
            'email' => $request->email,
        ]);

        // Replace any existing roles with the selected one
        $user->syncRoles([$request->role]);

        return back()->with('success', 'User updated');
    }

    /**
     * Update user password
     */
    public function updatePassword(Request $request, User $user)
    {
        $request->validate([
            'password' => ['required', 'min:8', 'confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Password updated');
    }
}
