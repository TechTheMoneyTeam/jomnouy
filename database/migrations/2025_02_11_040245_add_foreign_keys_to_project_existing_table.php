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
            $table->foreign(['project_id'], 'project_existing_project_id_fkey')->references(['project_id'])->on('project')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_existing', function (Blueprint $table) {
            $table->dropForeign('project_existing_project_id_fkey');
        });
    }
};
