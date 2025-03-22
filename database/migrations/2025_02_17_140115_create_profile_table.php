<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('profile', function (Blueprint $table) {
            $table->string('username', 50)->nullable();
            $table->integer('profile_id')->primary();
            $table->integer('user_id')->nullable();
            $table->string('contact_info')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('bio', 500)->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('profile');
    }
};
