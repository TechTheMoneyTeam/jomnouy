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
        Schema::table('startup_prototype', function (Blueprint $table) {
            // Check if the 'project_id' column exists
            if (Schema::hasColumn('startup_prototype', 'project_id')) {
                // Add foreign key constraint
                $table->foreign('project_id', 'startup_prototype_project_id_fkey')
                    ->references('id') // Assuming 'id' is the primary key in 'project'
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
        Schema::table('startup_prototype', function (Blueprint $table) {
            // Drop the foreign key constraint if it exists
            $table->dropForeign('startup_prototype_project_id_fkey');
        });
    }
};