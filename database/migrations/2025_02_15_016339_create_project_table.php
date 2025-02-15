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
        Schema::create('project', function (Blueprint $table) {
            $table->id(); // Primary key 'id'
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // References 'id' of the 'users' table
            $table->string('title');
            $table->decimal('funding_goal', 15, 2);
            $table->string('status');
            $table->timestamps(); // Adds 'created_at' and 'updated_at'
            
            // The project type (startup, existing, etc.)
            $table->foreignId('project_type_id')->constrained('project_type'); // Foreign key for project type

            // The category for the project (e.g., technology, science)
            $table->foreignId('category_id')->constrained('category'); // Foreign key for category

            // Project description
            $table->text('project_des');
            
            // Project image
            $table->string('project_img');
            
            // Reverse price
            $table->decimal('reverse_price', 15, 2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project');
    }
};
