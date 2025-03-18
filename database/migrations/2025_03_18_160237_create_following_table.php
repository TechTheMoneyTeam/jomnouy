<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('followers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // The user who is following
            $table->unsignedBigInteger('followed_user_id'); // The user being followed
            $table->timestamps();
            
            // Add foreign key constraints if your database setup supports them
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('followed_user_id')->references('user_id')->on('users')->onDelete('cascade');
            
            // Ensure a user can't follow another user more than once
            $table->unique(['user_id', 'followed_user_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('followers');
    }
};