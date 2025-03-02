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
                             ->with('user')
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
            // Fetch all projects with user relationship
            $projects = Project::with('user')->get();
            return response()->json($projects, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch projects: ' . $e->getMessage()], 500);
        }
    }

    public function getProjectsByType($type)
    {
        try {
            // Fetch projects by type
            $projects = Project::where('project_type', $type)
                         ->with('user')
                         ->orderBy('created_at', 'desc')
                         ->get();
            
            return response()->json($projects, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch projects by type: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $project = Project::with('user')->find($id);
            
            if (!$project) {
                return response()->json([
                    'message' => 'Project not found'
                ], 404);
            }
            
            return response()->json($project, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch project: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $project = Project::find($id);
            
            if (!$project) {
                return response()->json([
                    'message' => 'Project not found'
                ], 404);
            }
            
            // Validate the request
            $validator = Validator::make($request->all(), [
                'title' => 'nullable|string|max:100',
                'funding_goal' => 'nullable|numeric',
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
                'status' => 'nullable|string|max:20',
                'auction_start_date' => 'nullable|date',
                'auction_end_date' => 'nullable|date|after_or_equal:auction_start_date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Update fields if provided
            if ($request->has('title')) $project->title = $request->title;
            if ($request->has('funding_goal')) $project->funding_goal = $request->funding_goal;
            if ($request->has('project_type')) $project->project_type = $request->project_type;
            if ($request->has('project_des')) $project->project_des = $request->project_des;
            if ($request->has('project_story')) $project->project_story = $request->project_story;
            if ($request->has('reserve_price')) $project->reserve_price = $request->reserve_price;
            if ($request->has('categories')) $project->categories = $request->categories;
            if ($request->has('member_name')) $project->member_name = $request->member_name;
            if ($request->has('member_position')) $project->member_position = $request->member_position;
            if ($request->has('project_location')) $project->project_location = $request->project_location;
            if ($request->has('status')) $project->status = $request->status;
            if ($request->has('auction_start_date')) $project->auction_start_date = $request->auction_start_date;
            if ($request->has('auction_end_date')) $project->auction_end_date = $request->auction_end_date;
            
            // Handle project image upload
            if ($request->hasFile('project_img')) {
                // Delete old image if exists
                if ($project->project_img) {
                    Storage::disk('public')->delete($project->project_img);
                }
                
                $imagePath = $request->file('project_img')->store('project_images', 'public');
                $project->project_img = $imagePath;
            }

            // Handle project video upload
            if ($request->hasFile('project_video')) {
                // Delete old video if exists
                if ($project->project_video) {
                    Storage::disk('public')->delete($project->project_video);
                }
                
                $videoPath = $request->file('project_video')->store('project_videos', 'public');
                $project->project_video = $videoPath;
            }
            
            $project->updated_at = now();
            $project->save();
            
            // Load the user relationship
            $project->load('user');
            
            return response()->json([
                'message' => 'Project updated successfully',
                'project' => $project
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Project update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $project = Project::find($id);
            
            if (!$project) {
                return response()->json([
                    'message' => 'Project not found'
                ], 404);
            }
            
            // Delete associated files
            if ($project->project_img) {
                Storage::disk('public')->delete($project->project_img);
            }
            
            if ($project->project_video) {
                Storage::disk('public')->delete($project->project_video);
            }
            
            // Delete the project
            $project->delete();
            
            return response()->json([
                'message' => 'Project deleted successfully'
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Project deletion failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}