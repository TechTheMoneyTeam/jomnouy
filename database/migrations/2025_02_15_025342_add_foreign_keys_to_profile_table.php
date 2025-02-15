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
        Schema::table('profile', function (Blueprint $table) {
            // Check if the 'user_id' column exists before adding the foreign key
            if (!Schema::hasColumn('profile', 'user_id')) {
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->onUpdate('no action');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profile', function (Blueprint $table) {
            // Drop the foreign key constraint if it exists
            $table->dropForeign('profile_user_id_fkey');
            
            // Optionally, drop the column if needed
            $table->dropColumn('user_id');
        });
    }
};
