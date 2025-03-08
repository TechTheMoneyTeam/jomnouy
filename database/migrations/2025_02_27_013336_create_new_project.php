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
        Schema::table('projects', function (Blueprint $table) {
            // Add project_video column
            $table->string('project_video')->nullable()->after('project_img');
            
            // Add project_location column
            $table->string('project_location', 200)->nullable()->after('project_img');
            
            // Replace project_categoryId with categories
            if (Schema::hasColumn('projects', 'project_categoryId')) {
                $table->dropColumn('project_categoryId');
            }
            $table->string('categories', 100)->nullable()->after('reserve_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Reverse the changes
            $table->dropColumn('project_video');
            $table->dropColumn('project_location');
            $table->dropColumn('categories');
            $table->integer('project_categoryId')->nullable()->after('reserve_price');
        });
    }
};