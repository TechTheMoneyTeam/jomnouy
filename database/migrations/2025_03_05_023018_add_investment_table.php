<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('investment', function (Blueprint $table) {
            // Use auto-incrementing primary key
            $table->id('investment_id');

            // Project relationship
            $table->integer('project_id'); // Ensure this matches the projects table

            // User relationship
            $table->integer('user_id'); // Change to integer to match the users table
            $table->foreign('user_id')
                ->references('user_id')
                ->on('users')
                ->onDelete('cascade');

            // Foreign key for project_id
            $table->foreign('project_id')
                ->references('project_id')
                ->on('projects')
                ->onDelete('cascade');

            // Investment details
            $table->decimal('amount', 15, 2)->default(0);
            $table->string('status', 20)->default('active');
            $table->timestamp('investment_date')->useCurrent();

            // Optional equity tracking
            $table->decimal('equity', 5, 2)->nullable()->comment('Percentage of project equity');

            // Audit columns
            $table->timestamps();

            // Indexing for performance
            $table->index(['project_id', 'user_id']);
            $table->index('investment_date');
        });
    }

    public function down()
    {
        // Drop foreign keys before dropping table
        Schema::table('investment', function (Blueprint $table) {
            $table->dropForeignKey(['project_id']);
            $table->dropForeignKey(['user_id']);
        });

        Schema::dropIfExists('investment');
    }
};