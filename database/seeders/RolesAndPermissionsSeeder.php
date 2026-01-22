<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        /*
        |--------------------------------------------------------------------------
        | Permissions
        |--------------------------------------------------------------------------
        */

        // Admin panel
        Permission::firstOrCreate(['name' => 'access admin panel']);

        // Content moderation
        Permission::firstOrCreate(['name' => 'delete any post']);
        Permission::firstOrCreate(['name' => 'delete any recipe']);
        Permission::firstOrCreate(['name' => 'delete any community recipe']);

        // Course & lecture management
        Permission::firstOrCreate(['name' => 'create courses']);
        Permission::firstOrCreate(['name' => 'edit courses']);
        Permission::firstOrCreate(['name' => 'delete courses']);
        Permission::firstOrCreate(['name' => 'create lectures']);
        Permission::firstOrCreate(['name' => 'edit lectures']);
        Permission::firstOrCreate(['name' => 'delete lectures']);

        // Community actions
        Permission::firstOrCreate(['name' => 'create post']);
        Permission::firstOrCreate(['name' => 'create recipe']);
        Permission::firstOrCreate(['name' => 'create community recipe']);

        /*
        |--------------------------------------------------------------------------
        | Roles
        |--------------------------------------------------------------------------
        */

        // Admin
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions(Permission::all());

        // Cohort (community member / student)
        $cohort = Role::firstOrCreate(['name' => 'cohort']);
        $cohort->syncPermissions([
            'create post',
            'create recipe',
            'create community recipe',
        ]);

        // (Optional future-proof role)
        // Instructor – can manage their own courses later
        $instructor = Role::firstOrCreate(['name' => 'instructor']);
        $instructor->syncPermissions([
            'create courses',
            'edit courses',
            'create lectures',
            'edit lectures',
        ]);
    }
}
