<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::rename('model_has_roles', 'user_has_roles');
}

public function down()
{
    Schema::rename('user_has_roles', 'model_has_roles');
}
};
