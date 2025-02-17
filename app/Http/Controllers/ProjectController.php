<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    // Display a listing of projects
    public function index()
    {
        try {
            $projects = Project::with('user')->latest()->get();
            
            return response()->json([
                'data' => $projects
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching projects',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Show the form to create a new project
    public function create()
    {
        return view('project.create'); // No categories needed
    }

    // Store a new project
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'project_des' => 'required|string|min:50',
            'funding_goal' => 'required|numeric|min:1',
            'reverse_price' => 'required|numeric|min:0|lte:funding_goal',
            'project_img' => 'required|string|url',
            'status' => 'required|string|in:draft,published,closed'
        ]);

        try {
            $project = Project::create([
                'user_id' => $request->user()->id, // Get authenticated user's ID
                ...$validatedData
            ]);

            return response()->json([
                'message' => 'Project created successfully',
                'data' => $project
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Upload a file
    public function uploadFile(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,gif|max:10240'
        ]);

        try {
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('project-files', $filename, 'public');

            return response()->json([
                'message' => 'File uploaded successfully',
                'url' => Storage::url($path)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error uploading file',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}