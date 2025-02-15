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
            // Add the user_id column if it doesn't already exist
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Add foreign key for project_id
            $table->foreign('project_id', 'comments_project_id_fkey')
                  ->references('id')->on('project')
                  ->onUpdate('no action')
                  ->onDelete('cascade');
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
            $table->dropColumn('user_id'); // Drop the user_id column
        });
    }
};
