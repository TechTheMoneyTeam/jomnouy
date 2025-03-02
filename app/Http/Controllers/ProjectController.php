<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
                'project_img' => 'nullable|string',
                'reserve_price' => 'nullable|numeric',
                'project_categoryId' => 'nullable|integer',
                'status' => 'nullable|string|in:pending,in_progress,completed'
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

            // Find the next available project_id by checking the highest project_id
            $maxProjectId = Project::max('project_id');  // Get the highest project_id currently in the database
            $projectId = $maxProjectId + 1;  // Set the new project_id to the next available ID

            // Create project with the generated ID and user_id
            // Create project with the generated ID and user_id
            $project = Project::create([
                'project_id' => $projectId,  // Ensure this is passed
                'user_id' => $validatedData['user_id'],
                'title' => $request->title,
                'funding_goal' => $request->funding_goal,
                'project_type' => $request->project_type,
                'project_des' => $request->project_des,
                'project_img' => $request->project_img,
                'reserve_price' => $request->reserve_price,
                'project_categoryId' => $request->project_categoryId,
                'status' => $validatedData['status'] ?? 'pending',
                'created_at' => now(),
                'updated_at' => now()
            ]);

            // Load the user relationship
            $project->load('user');

            return response()->json([
                'message' => 'Project created successfully',
                'project' => $project
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Project creation failed',
                'error' => $e->getMessage() // Include the error message for debugging
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
    public function show($id)
    {
        try {
            $project = Project::where('project_id', $id)->first();

            if (!$project) {
                return response()->json(['message' => 'Project not found'], 404);
            }

            return response()->json($project);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred',
                'error' => $e->getMessage()
            ], 500);
        }
    }



}