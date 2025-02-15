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
            // Check if the 'category_id' column exists
            if (Schema::hasColumn('project', 'category_id')) {
                $table->foreign('category_id', 'project_category_id_fkey')
                    ->references('id') // Reference the 'id' column in category table
                    ->on('category')
                    ->onUpdate('no action')
                    ->onDelete('set null'); // Set null on delete (or change to 'cascade' if needed)
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
            $table->dropForeign('project_category_id_fkey');
        });
    }
};
