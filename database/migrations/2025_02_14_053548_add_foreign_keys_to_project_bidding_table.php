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
        Schema::table('project_bidding', function (Blueprint $table) {
            $table->foreign(['auction_id'], 'project_bidding_auction_id_fkey')->references(['auction_id'])->on('project_auction')->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['project_id'], 'project_bidding_project_id_fkey')->references(['project_id'])->on('project')->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['user_id'], 'project_bidding_user_id_fkey')->references(['user_id'])->on('users')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_bidding', function (Blueprint $table) {
            $table->dropForeign('project_bidding_auction_id_fkey');
            $table->dropForeign('project_bidding_project_id_fkey');
            $table->dropForeign('project_bidding_user_id_fkey');
        });
    }
};
