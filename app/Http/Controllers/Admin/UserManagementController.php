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

}
