<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;
use App\Models\Project;
use Illuminate\Support\Facades\DB;

class FavoriteController extends Controller
{
    /**
     * Display a listing of the user's favorite projects.
     */
    public function index($userId)
    {
        // Get favorite projects using Eloquent relationships
        $favorites = Favorite::where('user_id', $userId)
            ->with('project')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($favorite) {
                $project = $favorite->project;
                
                // Calculate total invested amount
                $totalInvested = DB::table('investments')
                    ->where('project_id', $project->project_id)
                    ->sum('amount');
                
                // Add total_invested to the project
                $project->total_invested = $totalInvested ?? 0;
                
                // Explicitly append the accessor attributes
                $project->append(['project_img_url', 'project_video_url']);
                
                // Add favorited_at timestamp
                $project->favorited_at = $favorite->created_at;
                
                return $project;
            });

        return response()->json($favorites);
    }

    /**
     * Check if a project is favorited by the user.
     */
    public function check($userId, $projectId)
    {
        $favorite = Favorite::where('user_id', $userId)
            ->where('project_id', $projectId)
            ->first();
        
        if (!$favorite) {
            return response()->json(['favorited' => false], 200);
        }
        
        return response()->json([
            'favorited' => true,
            'data' => $favorite
        ]);
    }

    /**
     * Store a newly created favorite in storage.
     */
    public function store(Request $request, $userId)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,project_id',
        ]);
        
        // Check if already favorited
        $existing = Favorite::where('user_id', $userId)
            ->where('project_id', $request->project_id)
            ->first();
        
        if ($existing) {
            return response()->json(['error' => 'Project already in favorites'], 409);
        }
        
        // Add to favorites
        $favorite = new Favorite();
        $favorite->user_id = $userId;
        $favorite->project_id = $request->project_id;
        $favorite->save();
        
        // Return the project with accessors
        $project = Project::find($request->project_id);
        $project->append(['project_img_url', 'project_video_url']);
        
        return response()->json([
            'message' => 'Project added to favorites successfully',
            'favorite' => $favorite,
            'project' => $project
        ], 201);
    }

    /**
     * Remove the specified favorite from storage.
     */
    public function destroy($userId, $projectId)
    {
        $favorite = Favorite::where('user_id', $userId)
            ->where('project_id', $projectId)
            ->first();
        
        if (!$favorite) {
            return response()->json(['error' => 'Favorite not found'], 404);
        }
        
        $favorite->delete();
        
        return response()->json(['message' => 'Favorite removed successfully']);
    }
}