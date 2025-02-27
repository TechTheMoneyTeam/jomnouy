<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,user_id',
                'title' => 'nullable|string|max:100',
                'funding_goal' => 'nullable|numeric',
                'status' => 'nullable|string|max:20',
                'project_type' => 'nullable|string|max:20',
                'project_des' => 'nullable|string|max:1000',
                'project_story' => 'nullable|string|max:1000',
                'project_img' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
                'project_video' => 'nullable|file|mimes:mp4,mov,avi,wmv|max:20480',
                'reserve_price' => 'nullable|numeric',
                'categories' => 'nullable|string|max:100',
                'member_name' => 'nullable|string|max:100',
                'member_position' => 'nullable|string|max:100',
                'project_location' => 'nullable|string|max:200',
                // 'status' => 'nullable|string|in:pending,in_progress,completed',
                'auction_start_date' => 'nullable|date',
                'auction_end_date' => 'nullable|date|after_or_equal:auction_start_date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validatedData = $validator->validated();
            
            // Verify user exists
            $user = User::where('user_id', $validatedData['user_id'])->first();
            
            if (!$user) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }
            
            // Find the next available project_id between 1 and 1064
            $projectId = null;
            $existingIds = Project::pluck('project_id')->toArray();
            
            for ($i = 1; $i <= 1064; $i++) {
                if (!in_array($i, $existingIds)) {
                    $projectId = $i;
                    break;
                }
            }
            
            // Check if we found an available ID
            if ($projectId === null) {
                throw new \Exception('No available project IDs remaining');
            }

            // Handle file uploads
            $projectData = [
                'project_id' => $projectId,
                'user_id' => $validatedData['user_id'],
                'title' => $request->title,
                'funding_goal' => $request->funding_goal,
                'project_type' => $request->project_type,
                'project_des' => $request->project_des,
                'project_story' => $request->project_story,
                'member_name' => $request->member_name,
                'member_position' => $request->member_position,
                'reserve_price' => $request->reserve_price,
                'categories' => $request->categories,
                'project_location' => $request->project_location,
                'status' => $validatedData['status'] ?? 'pending',
                'auction_start_date' => $request->auction_start_date,
                'auction_end_date' => $request->auction_end_date,
                'created_at' => now(),
                'updated_at' => now()
            ];

            // Handle project image upload
            if ($request->hasFile('project_img')) {
                $imagePath = $request->file('project_img')->store('project_images', 'public');
                $projectData['project_img'] = $imagePath;
            }

            // Handle project video upload (optional)
            if ($request->hasFile('project_video')) {
                $videoPath = $request->file('project_video')->store('project_videos', 'public');
                $projectData['project_video'] = $videoPath;
            }

            // Create project with the generated ID and data
            $project = Project::create($projectData);

            // Load the user relationship
            $project->load('user');

            return response()->json([
                'message' => 'Project created successfully',
                'project' => $project
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Project creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserProjects($userId)
    {
        try {
            // Verify user exists
            $user = User::where('user_id', $userId)->first();
            
            if (!$user) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }

            $projects = Project::where('user_id', $userId)
                             ->orderBy('created_at', 'desc')
                             ->get();

            return response()->json([
                'projects' => $projects
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch projects',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function index()
    {
        try {
            // Fetch all projects
            $projects = Project::all();
            return response()->json($projects, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch projects: ' . $e->getMessage()], 500);
        }
    }
}