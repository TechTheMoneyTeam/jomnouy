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
            $table->foreign(['project_id'], 'startup_prototype_project_id_fkey')->references(['project_id'])->on('project')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('startup_prototype', function (Blueprint $table) {
            $table->dropForeign('startup_prototype_project_id_fkey');
        });
    }
};
