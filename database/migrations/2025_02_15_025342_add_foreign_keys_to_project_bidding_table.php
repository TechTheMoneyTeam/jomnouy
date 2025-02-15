<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_bidding', function (Blueprint $table) {
            // First modify the columns to match the referenced tables
            $table->integer('project_id')->unsigned()->nullable()->change();
            $table->integer('auction_id')->unsigned()->nullable()->change();
            $table->integer('user_id')->unsigned()->nullable()->change();

            // Then add the foreign keys with correct column references
            $table->foreign('auction_id', 'project_bidding_auction_id_fkey')
                ->references('auction_id')
                ->on('project_auction')
                ->onUpdate('no action')
                ->onDelete('cascade');

            $table->foreign('project_id', 'project_bidding_project_id_fkey')
                ->references('id')  // Changed from 'project_id' to 'id'
                ->on('project')
                ->onUpdate('no action')
                ->onDelete('cascade');

            $table->foreign('user_id', 'project_bidding_user_id_fkey')
                ->references('id')  // Assuming users table also uses 'id' as primary key
                ->on('users')
                ->onUpdate('no action')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('project_bidding', function (Blueprint $table) {
            $table->dropForeign('project_bidding_auction_id_fkey');
            $table->dropForeign('project_bidding_project_id_fkey');
            $table->dropForeign('project_bidding_user_id_fkey');
            
            $table->integer('project_id')->nullable()->change();
            $table->integer('auction_id')->nullable()->change();
            $table->integer('user_id')->nullable()->change();
        });
    }
};