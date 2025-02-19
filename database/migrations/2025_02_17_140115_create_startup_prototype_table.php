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
        Schema::create('startup_prototype', function (Blueprint $table) {
            $table->integer('project_id')->primary();
            $table->float('min_equity')->nullable();
            $table->float('max_equity')->nullable();
            $table->float('required_funding')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('startup_prototype');
    }
};
