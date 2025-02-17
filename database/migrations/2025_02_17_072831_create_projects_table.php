<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('project_des');
            $table->decimal('funding_goal', 15, 2);
            $table->decimal('reverse_price', 15, 2);
            $table->string('project_img');
            $table->enum('status', ['draft', 'published', 'closed'])->default('draft');
            $table->timestamps();
            $table->softDeletes(); // In case you want to implement soft deletes
        });
    }

    public function down()
    {
        Schema::dropIfExists('projects');
    }
};