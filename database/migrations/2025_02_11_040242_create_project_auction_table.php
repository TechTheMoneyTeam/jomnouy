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
            $table->increments('auction_id');
            $table->integer('project_id')->nullable();
            $table->float('currect_bid')->nullable();
            $table->string('status', 25)->nullable();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->integer('target')->nullable();
            $table->integer('bidder_amount')->nullable();
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
