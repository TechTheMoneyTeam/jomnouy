<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUpdatesTable extends Migration
{
    public function up(): void
    {
        Schema::create('updates', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->unsignedInteger('project_id'); // Foreign key to match the type in projects table
            $table->string('title'); // Title for the update
            $table->text('description'); // Description for the update
            $table->date('update_date'); // Date of the update
            $table->string('file_path')->nullable(); // File path (nullable)
            $table->timestamps(); // created_at and updated_at timestamps

            // Foreign key constraint
            $table->foreign('project_id')
                ->references('project_id') // Reference to project_id in projects table
                ->on('projects')
                ->onDelete('cascade'); // Optional: delete updates when the associated project is deleted
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('updates');
    }
}
