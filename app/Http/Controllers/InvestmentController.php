<?php

namespace App\Http\Controllers;

use App\Models\Investment;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InvestmentController extends Controller
{
    /**
     * Create a new investment for a project
     *
     * @param Request $request
     * @param int $projectId
     * @return \Illuminate\Http\JsonResponse
     */
    public function invest(Request $request, $projectId)
    {
        try {
            // Validate input
            $validatedData = $request->validate([
                'amount' => 'required|numeric|min:0.01',
                'user_id' => 'required|exists:users,user_id',
                'equity' => 'sometimes|numeric|min:0|max:100'
            ]);

            // Find the project
            $project = Project::findOrFail($projectId);

            // Start database transaction
            return DB::transaction(function () use ($validatedData, $project) {
                // Calculate total investment for the project before adding new investment
                $previousTotalInvestment = Investment::where('project_id', $project->project_id)
                    ->sum('amount');
                
                // Calculate new total amount
                $newTotalAmount = $previousTotalInvestment + $validatedData['amount'];

                // Create investment with total amount
                $investment = Investment::create([
                    'project_id' => $project->project_id,
                    'user_id' => $validatedData['user_id'],
                    'amount' => $validatedData['amount'],
                    'total_amount' => $newTotalAmount, // Explicitly set total amount
                    'investment_date' => now(),
                    'equity' => $validatedData['equity'] ?? null
                ]);

                // Calculate total investment for the project
                $totalInvestment = Investment::where('project_id', $project->project_id)
                    ->sum('amount');

                // Find top investor
                $topInvestor = Investment::select('user_id')
                    ->where('project_id', $project->project_id)
                    ->groupBy('user_id')
                    ->orderByRaw('SUM(amount) DESC')
                    ->first();

                // Update project details
                $project->update([
                    'total_invested' => $totalInvestment,
                    'top_investor_id' => $topInvestor ? $topInvestor->user_id : null
                ]);

                return response()->json([
                    'message' => 'Investment successful',
                    'investment' => $investment,
                    'total_invested' => $totalInvestment,
                    'total_amount' => $newTotalAmount
                ], 201);
            });

        } catch (ValidationException $e) {
            // Handle validation errors
            return response()->json([
                'error' => 'Validation failed',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // Log the error and return a generic error response
            \Log::error('Investment creation failed: ' . $e->getMessage());

            return response()->json([
                'error' => 'Investment failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retrieve investments for a specific project
     *
     * @param int $projectId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProjectInvestments($projectId)
    {
        // Validate project exists
        Project::findOrFail($projectId);

        // Retrieve investments
        $investments = Investment::where('project_id', $projectId)
            ->with(['user' => function($query) {
                $query->select('user_id', 'name', 'email');
            }])
            ->orderByDesc('amount')
            ->get();

        return response()->json($investments);
    }

    /**
     * Get user's total investments across all projects
     *
     * @param int $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserInvestments($userId)
    {
        // Validate user exists
        User::findOrFail($userId);

        $investments = Investment::where('user_id', $userId)
            ->with('project:project_id,name,description')
            ->orderByDesc('investment_date')
            ->get();

        $totalInvestments = $investments->sum('amount');

        return response()->json([
            'total_investments' => $totalInvestments,
            'investments' => $investments
        ]);
    }

    public function getProjectTotalInvestment($projectId)
    {
        try {
            // Calculate the total investment amount for the project
            $totalAmount = Investment::where('project_id', $projectId)->sum('amount');

            return response()->json([
                'total_amount' => $totalAmount,
                'project_id' => $projectId
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching project total investment: ' . $e->getMessage());

            return response()->json([
                'error' => 'Failed to retrieve total investment',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}