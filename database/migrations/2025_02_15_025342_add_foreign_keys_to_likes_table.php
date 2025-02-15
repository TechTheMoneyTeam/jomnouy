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
        Schema::table('likes', function (Blueprint $table) {
            // Check if the column 'project_id' exists before adding the foreign key
            if (!Schema::hasColumn('likes', 'project_id')) {
                $table->foreignId('project_id')->constrained('project')->onDelete('cascade')->onUpdate('no action');
            }

            // Check if the column 'user_id' exists before adding the foreign key
            if (!Schema::hasColumn('likes', 'user_id')) {
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->onUpdate('no action');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('likes', function (Blueprint $table) {
            // Drop the foreign key constraints
            $table->dropForeign('likes_project_id_fkey');
            $table->dropForeign('likes_user_id_fkey');
            
            // Optionally, drop the columns if needed
            $table->dropColumn('project_id');
            $table->dropColumn('user_id');
        });
    }
};
