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
        Schema::create('project_auction', function (Blueprint $table) {
            $table->increments('auction_id'); // Primary key
            $table->foreignId('project_id')->constrained('project')->onDelete('cascade'); // Foreign key to project table
            $table->float('current_bid')->nullable(); // Corrected the column name
            $table->string('status', 25)->nullable();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->integer('target')->nullable();
            $table->integer('bidder_amount')->nullable();
            $table->timestamps(); // Optional for created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_auction');
    }
};