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
        Schema::table('project', function (Blueprint $table) {
            // Check if the 'project_type' column exists
            if (Schema::hasColumn('project', 'project_type')) {
                $table->foreign('project_type', 'project_project_type_fkey')
                    ->references('name') // Reference the 'name' column in project_type
                    ->on('project_type')
                    ->onUpdate('no action')
                    ->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project', function (Blueprint $table) {
            // Drop the foreign key constraint if it exists
            $table->dropForeign('project_project_type_fkey');
        });
    }
};