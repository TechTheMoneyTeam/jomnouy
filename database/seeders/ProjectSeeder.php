<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('projects')->insert([
            [
                'project_id' => 1,
                'user_id' => 1,
                'title' => 'Project Alpha',
                'funding_goal' => 50000.00,
                'status' => 'active',
                'created_at' => now(),
                'project_type' => 'Research',
                'project_des' => 'This is a test description for Project Alpha.',
                'project_img' => 'project_alpha.jpg',
                'reserve_price' => 20000.00,
                'project_categoryId' => 1,
            ],
            [
                'project_id' => 2,
                'user_id' => 2,
                'title' => 'Project Beta',
                'funding_goal' => 100000.00,
                'status' => 'completed',
                'created_at' => now(),
                'project_type' => 'Technology',
                'project_des' => 'This is a test description for Project Beta.',
                'project_img' => 'project_beta.jpg',
                'reserve_price' => 40000.00,
                'project_categoryId' => 2,
            ],
            [
                'project_id' => 3,
                'user_id' => 3,
                'title' => 'Project Gamma',
                'funding_goal' => 75000.00,
                'status' => 'inactive',
                'created_at' => now(),
                'project_type' => 'Business',
                'project_des' => 'This is a test description for Project Gamma.',
                'project_img' => 'project_gamma.jpg',
                'reserve_price' => 30000.00,
                'project_categoryId' => 3,
            ],
        ]);
    }
}
