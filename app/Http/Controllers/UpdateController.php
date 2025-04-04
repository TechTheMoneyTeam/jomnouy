<?php

namespace App\Http\Controllers;

use App\Models\Update;
use App\Models\Investment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UpdateController extends Controller
{
    /**
     * Store a newly created update in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate input
        $request->validate([
            'project_id' => 'required|integer|exists:projects,project_id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'update_date' => 'required|date',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'profit_amount' => 'nullable|decimal:0,2',

        ]);

        try {
            // Initialize file path
            $filePath = null;

            // Process the file if present
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                // Store the file in the 'public/uploads' directory
                $filePath = $file->store('uploads', 'public');
            }

            // Save the update in the database
            $update = new Update();
            $update->project_id = $request->input('project_id');
            $update->title = $request->input('title');
            $update->description = $request->input('description');
            $update->update_date = $request->input('update_date');
            $update->file_path = $filePath;

            $update->profit_amount = $request->profit_amount;
            $update->save();

            return response()->json(['message' => 'Update created successfully!'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create update: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Retrieve updates for projects that a specific investor has invested in.
     *
     * @param  int  $investorId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInvestorUpdates1($investorId)
    {
        try {
            // Find all project IDs where this investor has invested
            $projectIds = Investment::where('user_id', $investorId)->pluck('project_id');

            // Get updates only for the projects the investor has invested in
            $updates = Update::whereIn('project_id', $projectIds)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($updates);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve updates: ' . $e->getMessage()], 500);
        }
    }
}
