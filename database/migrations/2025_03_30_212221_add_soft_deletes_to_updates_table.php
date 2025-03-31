<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSoftDeletesToUpdatesTable extends Migration
{
    public function up()
    {
        Schema::table('updates', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::table('updates', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
}
