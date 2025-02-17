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
        Schema::create('projects', function (Blueprint $table) {
            $table->integer('project_id')->primary();
            $table->integer('user_id')->nullable();
            $table->string('title', 100)->nullable();
            $table->float('funding_goal')->nullable();
            $table->string('status', 20)->nullable();
            $table->timestamp('created_at')->nullable();
            $table->string('project_type', 20)->nullable();
            $table->string('project_des', 1000)->nullable();
            $table->string('project_img')->nullable();
            $table->float('reserve_price')->nullable();
            $table->integer('project_categoryId')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
