<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMilestonesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('milestones', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->unsignedInteger('project_id'); // Foreign key to projects table
            $table->string('milestone_name'); // Name of the milestone
            $table->integer('completion_percentage')->default(0); // Completion percentage (0-100)
            $table->date('due_date'); // Due date for milestone completion
            $table->string('status')->default('on track'); // Status of milestone (e.g., on track, delayed, completed)
            $table->timestamps(); // created_at and updated_at timestamps

            // Foreign key constraint to the projects table
            $table->foreign('project_id')->references('project_id')->on('projects')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('milestones');
    }
}
