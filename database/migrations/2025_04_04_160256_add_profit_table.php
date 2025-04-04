<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
/**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('updates', function (Blueprint $table) {
            $table->decimal('profit_amount', 10, 2)->nullable()->after('update_date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('updates', function (Blueprint $table) {
            $table->dropColumn('profit_amount');
        });
    }
};
