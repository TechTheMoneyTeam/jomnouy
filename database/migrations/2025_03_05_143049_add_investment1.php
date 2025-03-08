<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('investment', function (Blueprint $table) {
            $table->decimal('total_amount', 15, 2)->nullable()->after('amount')
                ->comment('Total amount invested in the project');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('investment', function (Blueprint $table) {
            $table->dropColumn('total_amount');
        });
    }
};
