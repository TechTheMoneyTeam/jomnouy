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
            $table->increments('project_id');
            $table->integer('user_id')->nullable();
            $table->string('title', 100)->nullable();
            $table->float('funding_goal')->nullable();
            $table->string('status', 100)->nullable();
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->integer('project_type')->nullable();
            $table->string('project_des')->nullable();
            $table->string('project_image')->nullable();
            $table->string('project_video')->nullable();
            $table->float('reverse_price')->nullable();
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
