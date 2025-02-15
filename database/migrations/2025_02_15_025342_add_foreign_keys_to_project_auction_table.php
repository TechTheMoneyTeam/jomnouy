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
        Schema::table('project_auction', function (Blueprint $table) {
            // Check if the 'project_id' column exists before adding the foreign key
            if (!Schema::hasColumn('project_auction', 'project_id')) {
                $table->foreignId('project_id')->constrained('project')->onDelete('cascade')->onUpdate('no action');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_auction', function (Blueprint $table) {
            // Drop the foreign key constraint if it exists
            $table->dropForeign('project_auction_project_id_fkey');
            
            // Optionally, drop the column if needed
            $table->dropColumn('project_id');
        });
    }
};
