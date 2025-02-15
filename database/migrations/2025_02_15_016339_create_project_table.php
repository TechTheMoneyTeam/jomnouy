<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('project', function (Blueprint $table) {
            $table->id(); // Primary key 'id'
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // References 'id' of the 'users' table
            $table->string('title');
            $table->decimal('funding_goal', 15, 2);
            $table->string('status');
            $table->timestamps();
            $table->string('project_type');
            $table->text('project_des');
            $table->string('project_img');
            $table->decimal('reverse_price', 15, 2);
        });
    }
    
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project');
    }
};
