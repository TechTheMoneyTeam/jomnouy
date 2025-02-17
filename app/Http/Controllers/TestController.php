<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Comment;

class TestController extends Controller
{
    public function index()
    {
        // Fetch all projects with related comments and user profiles.
        $projects = Project::with(['comments', 'user.profile'])->get();
        return response()->json($projects);
    }

    public function show($id)
    {
        // Fetch a specific project with related data
        $project = Project::with(['comments', 'user.profile'])->findOrFail($id);
        return response()->json($project);
    }

    public function store(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'funding_goal' => 'required|numeric',
            'user_id' => 'required|exists:users,id',
        ]);

        // Create a new project
        $project = Project::create($validatedData);

        return response()->json($project, 201);
    }
}