<?php

return [

    'models' => [
        'permission' => Spatie\Permission\Models\Permission::class,
        'role' => Spatie\Permission\Models\Role::class,
    ],

    'table_names' => [
        'roles' => 'roles',
        'model_has_roles' => 'user_has_roles',
    ],

    'column_names' => [
        'role_pivot_key' => null,
        'model_morph_key' => 'model_id',
    ],

    'register_permission_check_method' => false,

    'teams' => false,

    'cache' => [
        'expiration_time' => \DateInterval::createFromDateString('24 hours'),
        'key' => 'spatie.permission.cache',
        'store' => 'default',
    ],
];
