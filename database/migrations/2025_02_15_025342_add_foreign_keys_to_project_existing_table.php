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
        Schema::table('project_existing', function (Blueprint $table) {
            // Check if the 'project_id' column exists and add foreign key if necessary
            if (Schema::hasColumn('project_existing', 'project_id')) {
                $table->foreign('project_id', 'project_existing_project_id_fkey')
                    ->references('id')  // Changed from 'project_id' to 'id'
                    ->on('project')
                    ->onUpdate('no action')
                    ->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_existing', function (Blueprint $table) {
            // Drop foreign key constraint if it exists
            $table->dropForeign('project_existing_project_id_fkey');
        });
    }
};