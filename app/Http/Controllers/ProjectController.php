<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'nullable|integer',
            'title' => 'nullable|string|max:100',
            'funding_goal' => 'nullable|numeric',
            'status' => 'nullable|string|max:20',
            'project_type' => 'nullable|string|max:20',
            'project_des' => 'nullable|string|max:1000',
            'project_img' => 'nullable|string',
            'reserve_price' => 'nullable|numeric',
            'project_categoryId' => 'nullable|integer',
            'project_id' => 'required|integer|unique:projects,project_id',
        ]);

        $project = Project::create([
            'project_id' => $request->project_id,
            'user_id' => $request->user_id,
            'title' => $request->title,
            'funding_goal' => $request->funding_goal,
            'status' => $request->status,
            'project_type' => $request->project_type,
            'project_des' => $request->project_des,
            'project_img' => $request->project_img,
            'reserve_price' => $request->reserve_price,
            'project_categoryId' => $request->project_categoryId,
            'created_at' => now(), // Manually set
            'updated_at' => now(), // Manually set

        ]);

        return response()->json($project, 201);
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
