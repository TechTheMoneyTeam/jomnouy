<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->unsignedInteger('user_id')->primary(); // Keep as unsignedInteger
            $table->string('username', 50)->unique('username');
            $table->string('first_name', 50)->nullable();
            $table->string('last_name', 50)->nullable();
            $table->string('profile_id', 50)->nullable();
            $table->string('email', 100)->unique('email');
            $table->enum('user_type', ['investor', 'entrepreneur', 'startup'])->nullable();
            $table->string('password');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
