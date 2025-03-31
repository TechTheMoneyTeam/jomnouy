<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use PhpParser\Node\Expr\FuncCall;

class ProjectController extends Controller
{
    /**
     * Display a listing of all projects.
     */
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

    /**
     * Store a newly created project in storage.
     */
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
                'auction_start_date' => 'nullable|date',
                'auction_end_date' => 'nullable|date|after_or_equal:auction_start_date',
                // Equity fields
                'equity_offered' => 'nullable|numeric|between:0,100',
                'equity_tiers' => 'nullable|json',
                'return_1_5_years' => 'nullable|numeric|between:0,100',
                'return_5_10_years' => 'nullable|numeric|between:0,100',
                'return_10_plus_years' => 'nullable|numeric|between:0,100',
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

            // Process equity tiers if provided
            $equityTiers = null;
            if ($request->has('equity_tiers') && !empty($request->equity_tiers)) {
                if (is_string($request->equity_tiers)) {
                    $equityTiers = json_decode($request->equity_tiers, true);
                } else {
                    $equityTiers = $request->equity_tiers;
                }

                // Validate each tier has required properties
                foreach ($equityTiers as $index => $tier) {
                    if (!isset($tier['amount']) || !isset($tier['equity_percentage'])) {
                        return response()->json([
                            'message' => 'Validation failed',
                            'errors' => ['equity_tiers' => ["Tier {$index} is missing required properties"]]
                        ], 422);
                    }

                    // Calculate percentage of total based on funding goal
                    if ($request->funding_goal > 0) {
                        $equityTiers[$index]['percentage_of_total'] =
                            round(($tier['amount'] / $request->funding_goal) * 100, 2);
                    }
                }

                // Re-encode as JSON for storage
                $equityTiers = json_encode($equityTiers);
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
                // Equity fields
                'equity_offered' => $request->equity_offered,
                'equity_tiers' => $equityTiers,
                'return_1_5_years' => $request->return_1_5_years,
                'return_5_10_years' => $request->return_5_10_years,
                'return_10_plus_years' => $request->return_10_plus_years,
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

    /**
     * Display the specified project.
     */
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

    
    public function getProjectsByCategory($category)
    public function getFilteredProjects(Request $request)
    {
        try {
            // Start building the query
            $query = Project::query();

            // Apply category filter if provided
            if ($request->has('category') && $request->category !== 'All categories') {
                $query->where('categories', $request->category);
            }

            // Apply project type filter only if it's not "All projects type"
            if ($request->has('type') && $request->type !== 'All projects type') {
                $query->where('project_type', $request->type);
            }

            // Filter for projects with auction ending within 1 to 7 days
            $query->whereBetween('auction_end_date', [
                Carbon::now()->addDays(1)->startOfDay(),
                Carbon::now()->addDays(7)->endOfDay()
            ]);

            // Execute query and get results
            $projects = $query->get();

            return response()->json($projects);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve projects',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function getProjectsByCategory($category)
    {
        $projects = Project::where('categories', $category)->get(); // Use the correct column name

        if ($projects->isEmpty()) {
            return response()->json(['message' => 'No projects found in this category'], 404);
        }

        return response()->json($projects);
    }

    // Update your controller
    public function getProjectsByCategoryRelated(Request $request)
{
    $category = $request->query('category');
    Log::info("Category filter received: " . $category);
    
    if (!$category) {
        // If no category is provided, return empty array instead of all projects
        Log::info("No category provided, returning empty collection");
        return response()->json([]);
    }
    
    // Try a LIKE query which works for both exact matches and text within comma-separated lists
    $projects = Project::where('categories', 'LIKE', "%{$category}%")->get();
    
    Log::info("Found " . count($projects) . " projects matching category: " . $category);
    
    return response()->json($projects);
}

    /**
     * Update the specified project in storage.
     * This method supports both PUT and POST with _method=PUT
     */
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
                // Equity fields
                'equity_offered' => 'nullable|numeric|between:0,100',
                'equity_tiers' => 'nullable|json',
                'return_1_5_years' => 'nullable|numeric|between:0,100',
                'return_5_10_years' => 'nullable|numeric|between:0,100',
                'return_10_plus_years' => 'nullable|numeric|between:0,100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Process equity tiers if provided
            if ($request->has('equity_tiers') && !empty($request->equity_tiers)) {
                $equityTiers = null;

                if (is_string($request->equity_tiers)) {
                    $equityTiers = json_decode($request->equity_tiers, true);
                } else {
                    $equityTiers = $request->equity_tiers;
                }

                // Validate each tier has required properties
                foreach ($equityTiers as $index => $tier) {
                    if (!isset($tier['amount']) || !isset($tier['equity_percentage'])) {
                        return response()->json([
                            'message' => 'Validation failed',
                            'errors' => ['equity_tiers' => ["Tier {$index} is missing required properties"]]
                        ], 422);
                    }

                    // Calculate percentage of total based on funding goal
                    if ($request->funding_goal > 0) {
                        $equityTiers[$index]['percentage_of_total'] =
                            round(($tier['amount'] / $request->funding_goal) * 100, 2);
                    }
                }

                // Re-encode as JSON for storage
                $project->equity_tiers = json_encode($equityTiers);
            }

            // Update fields if provided
            $fieldList = [
                'title',
                'funding_goal',
                'project_type',
                'project_des',
                'project_story',
                'reserve_price',
                'categories',
                'member_name',
                'member_position',
                'project_location',
                'status',
                'auction_start_date',
                'auction_end_date',
                // Equity fields
                'equity_offered',
                'return_1_5_years',
                'return_5_10_years',
                'return_10_plus_years'
            ];

            foreach ($fieldList as $field) {
                if ($request->has($field)) {
                    $project->{$field} = $request->{$field};
                }
            }

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

    /**
     * Remove the specified project from storage.
     */
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

    /**
     * Get projects by type.
     */
    public function getProjectsByType($type)
    {
        try {
            // Fetch projects by type
            $projects = Project::where('project_type', $type)
                ->with('user')
                ->orderBy('created_at', 'desc')
                ->get();

                ->with('user')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($projects, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch projects by type: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get all projects for a specific user.
     */
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
    public function getFilteredProjects(Request $request)
    {
        try {
            // Start building the query
            $query = Project::query();

            // Apply category filter if provided
            if ($request->has('category') && $request->category !== 'All categories') {
                $query->where('categories', $request->category);
            }

            // Apply project type filter only if it's not "All projects type"
            if ($request->has('type') && $request->type !== 'All projects type') {
                $query->where('project_type', $request->type);
            }

            // Filter for projects with auction ending within 1 to 7 days
            $query->whereBetween('auction_end_date', [
                Carbon::now()->addDays(1)->startOfDay(),
                Carbon::now()->addDays(7)->endOfDay()
            ]);

            // Execute query and get results
            $projects = $query->get();

            return response()->json($projects);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve projects',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function getEndingSoonPrject() 
    {
        try {
            $query = Project::query();
            $query->whereBetween('auction_end_date',[
                Carbon::now()->addDays(1)->startOfDay(),
                Carbon::now()->addDays(7)->endOfDay()
            ]);
            $projects =$query->get();
            return response()->json($projects);
        }catch
        (\Exception $e) {

        }
    }
    // public function getProjectsByLocation(Request $request)
    // {
    //     $city = $request->query('city');
    //     $country = $request->query('country');
    //     // Validate required parameters
    //     if (!$city || !$country) {
    //         return response()->json([
    //             'message' => 'City and country parameters are required'
    //         ], 400);
    //     }
       
    //     $projects = Project::where('project_location', 'LIKE', "%$city%$country%")
    //         ->orWhere('project_location', 'LIKE', "%$country%$city%")
    //         ->get();
    //     return response()->json($projects);
    // }
    public function getProjectsByLocation(Request $request)
    {
        try {
            $city = $request->query('city');
            $country = $request->query('country');

            // Validate required parameters
            if (!$city || !$country) {
                return response()->json([
                    'message' => 'City and country parameters are required'
                ], 400);
            }

            // Start building the query
            $query = Project::where('project_location', 'LIKE', "%$city%$country%")
                ->orWhere('project_location', 'LIKE', "%$country%$city%");
            // Apply category filter if provided
            if ($request->has('category') && $request->category !== 'All categories') {
                $query->where('categories', $request->category);
            }
            // Apply project type filter only if it's not "All projects type"
            if ($request->has('type') && $request->type !== 'All projects type') {
                $query->where('project_type', $request->type);
            }

            // Execute query and get results
            $projects = $query->get();

            return response()->json($projects);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve projects',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
}
