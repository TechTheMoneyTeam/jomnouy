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
        Schema::create('investment', function (Blueprint $table) {
            $table->increments('investment_id');
            $table->integer('project_id')->nullable();
            $table->integer('id')->nullable();
            $table->float('amount')->nullable();
            $table->string('status', 20)->nullable();
            $table->timestamp('investment_data')->nullable()->useCurrent();
            $table->integer('equity')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investment');
    }
};
