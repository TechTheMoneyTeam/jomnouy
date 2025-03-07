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
            $table->decimal('equity_offered', 8, 2)->nullable()->after('auction_end_date')
                ->comment('Overall percentage of equity being offered');
            
            $table->json('equity_tiers')->nullable()->after('equity_offered')
                ->comment('JSON structure of investment tiers and corresponding equity percentages');
            
            $table->decimal('return_1_5_years', 8, 2)->nullable()->after('equity_tiers')
                ->comment('Expected return percentage for 1-5 year investments');
            
            $table->decimal('return_5_10_years', 8, 2)->nullable()->after('return_1_5_years')
                ->comment('Expected return percentage for 5-10 year investments');
            
            $table->decimal('return_10_plus_years', 8, 2)->nullable()->after('return_5_10_years')
                ->comment('Expected return percentage for 10+ year investments');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'equity_offered',
                'equity_tiers',
                'return_1_5_years',
                'return_5_10_years',
                'return_10_plus_years'
            ]);
        });
    }
};