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
            // Truncate tables
            $this->truncateTables();

            // Insert project types
            $this->createProjectTypes();

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
        ];
        
        foreach ($tables as $table) {
            DB::table($table)->truncate();
        }
    }

    private function createProjectTypes()
    {
        DB::table('project_type')->insert([
            ['name' => 'startup'],
            ['name' => 'business'],
            ['name' => 'product'],
        ]);
    }

    private function createUser()
    {
        return DB::table('users')->insertGetId([
            'first_name' => 'Test',
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
        return DB::table('project')->insertGetId([
            'user_id' => $userId,
            'title' => 'Test Project',
            'funding_goal' => 10000.00,
            'status' => 'active',
            'created_at' => now(),
            'project_type' => 'startup', // Must match a value in project_type
            'project_des' => 'Test project description',
            'project_img' => 'test.jpg',
            'reverse_price' => 5000.00,
        ]);
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