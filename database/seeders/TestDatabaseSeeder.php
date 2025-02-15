<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class TestDatabaseSeeder extends Seeder
{
    public function run()
    {
        try {
            // Truncate tables to reset the database
            $this->truncateTables();

            // Insert project types
            $this->createProjectTypes();

            // Insert categories (ensure category_id = 1 exists)
            $this->createCategories();

            // Insert a user and get the user_id
            $userId = $this->createUser();

            // Insert profile with the user_id
            $this->createProfile($userId);

            // Insert project with the user_id and get the project_id
            $projectId = $this->createProject($userId);

            // Insert related data into other tables
            $this->createProjectExisting($projectId);
            $this->createStartupPrototype($projectId);
            $auctionId = $this->createProjectAuction($projectId);
            $this->createProjectBidding($projectId, $userId, $auctionId);
            $this->createInvestment($projectId, $userId);
            $this->createComment($projectId, $userId);

            echo "Test data inserted successfully!\n";
        } catch (\Exception $e) {
            echo "Error: " . $e->getMessage() . "\n";
        }
    }

    private function truncateTables()
    {
        $tables = [
            'users',
            'profile',
            'project',
            'project_existing',
            'startup_prototype',
            'project_auction',
            'project_bidding',
            'investment',
            'comments',
            'project_type',
            'category',
        ];

        foreach ($tables as $table) {
            DB::table($table)->truncate();
        }
    }

    private function createProjectTypes()
    {
        // Ensure the project_type table is populated with necessary data
        DB::table('project_type')->insert([
            ['name' => 'startup'],
            ['name' => 'business'],
            ['name' => 'product'],
        ]);
    }

    private function createCategories()
    {
        // Insert category data if category table is empty
        DB::table('category')->insert([
            ['id' => 1, 'name' => 'Technology'],
            ['id' => 2, 'name' => 'Healthcare'],
            ['id' => 3, 'name' => 'Education'],
        ]);
    }

    private function createUser()
    {
        return DB::table('users')->insertGetId([
            'first_name' => 'Nova',
            'last_name' => 'User',
            'user_name' => 'testuser',
            'email' => 'test@example.com',
            'pass_word' => Hash::make('password123'), // Hash password
            'user_type' => 'investor',
            'created_at' => now(),
            'updated_at' => now(),
            'image_profile' => null, // Optional
        ]);
    }

    private function createProfile($userId)
    {
        DB::table('profile')->insert([
            'user_id' => $userId,
            'contact_info' => 'test contact',
            'phone' => '1234567890',
            'bio' => 'Test bio',
        ]);
    }

    private function createProject($userId)
    {
        // Fetch the project_type_id for 'startup'
        $projectType = DB::table('project_type')->where('name', 'startup')->first();

        // Ensure the project_type is found before inserting the project
        if ($projectType) {
            // Insert a project with valid project_type_id and category_id
            return DB::table('project')->insertGetId([
                'user_id' => $userId,
                'title' => 'Test Project',
                'funding_goal' => 10000.00,
                'status' => 'active',
                'created_at' => now(),
                'project_type_id' => $projectType->id, // Correctly using the project_type_id
                'category_id' => 1,  // Ensure category_id exists in the category table
                'project_des' => 'Test project description',
                'project_img' => 'test.jpg',
                'reverse_price' => 5000.00,
            ]);
        } else {
            // Handle the error if the project_type is not found
            throw new \Exception('Project type "startup" not found.');
        }
    }

    private function createProjectExisting($projectId)
    {
        DB::table('project_existing')->insert([
            'project_id' => $projectId,
            'equity' => 20,
        ]);
    }

    private function createStartupPrototype($projectId)
    {
        DB::table('startup_prototype')->insert([
            'project_id' => $projectId,
            'min_equity' => 10,
            'max_equity' => 30,
        ]);
    }

    private function createProjectAuction($projectId)
    {
        DB::table('project_auction')->insert([
            'project_id' => $projectId,
            'current_bid' => 6000.00,
            'status' => 'active',
            'start_time' => now(),
            'end_time' => now()->addDays(7),
            'target' => 15000,
            'bidder_amount' => 0,
        ]);

        return DB::getPdo()->lastInsertId(); // Fetch the last inserted auction_id directly
    }

    private function createProjectBidding($projectId, $userId, $auctionId)
    {
        DB::table('project_bidding')->insert([
            'project_id' => $projectId,
            'user_id' => $userId,
            'bid_amount' => 6000.00,
            'bid_time' => now(),
            'auction_id' => $auctionId,
        ]);
    }

    private function createInvestment($projectId, $userId)
    {
        DB::table('investment')->insert([
            'project_id' => $projectId,
            'user_id' => $userId,
            'amount' => 6000.00,
            'status' => 'pending',
            'equity' => 15,
        ]);
    }

    private function createComment($projectId, $userId)
    {
        DB::table('comments')->insert([
            'project_id' => $projectId,
            'user_id' => $userId,
            'description' => 'Test comment',
        ]);
    }
}
