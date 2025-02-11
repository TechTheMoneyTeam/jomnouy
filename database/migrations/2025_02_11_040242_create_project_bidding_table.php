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
        Schema::create('project_bidding', function (Blueprint $table) {
            $table->increments('bid_id');
            $table->integer('project_id')->nullable();
            $table->integer('user_id')->nullable();
            $table->float('bid_amount')->nullable();
            $table->timestamp('bid_time')->nullable()->useCurrent();
            $table->integer('auction_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_bidding');
    }
};
