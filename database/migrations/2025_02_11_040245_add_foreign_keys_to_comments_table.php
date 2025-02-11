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
        Schema::table('comments', function (Blueprint $table) {
            $table->foreign(['project_id'], 'comments_project_id_fkey')->references(['project_id'])->on('project')->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['user_id'], 'comments_user_id_fkey')->references(['user_id'])->on('users')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropForeign('comments_project_id_fkey');
            $table->dropForeign('comments_user_id_fkey');
        });
    }
};
