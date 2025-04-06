<?php

namespace App\Http\Controllers;

use App\Models\Investment;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class InvestmentController extends Controller
{
    /**
     * Display a listing of all investments.
     */
    public function index()
    {
        try {
            // Fetch all investments with project and user relationships
            $investments = Investment::with(['project', 'user'])->get();
            return response()->json($investments, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch investments: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created investment in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'project_id' => 'required|exists:projects,project_id',
                'user_id' => 'required|exists:users,user_id',
                'amount' => 'required|numeric|min:0',
                'equity_percentage' => 'nullable|numeric|between:0,100',
                'payment_method' => 'required|string|max:50',
                'investment_notes' => 'nullable|string|max:1000',
                'investment_term' => 'required|string|in:1-5,5-10,10+',
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
    
            $validatedData = $validator->validated();
            
            // Verify project exists
            $project = Project::find($validatedData['project_id']);
            
            if (!$project) {
                return response()->json([
                    'message' => 'Project not found'
                ], 404);
            }
            
            // Check auction dates to determine if project is accepting investments
            $currentDate = Carbon::now();
            $auctionStartDate = $project->auction_start_date ? Carbon::parse($project->auction_start_date) : null;
            $auctionEndDate = $project->auction_end_date ? Carbon::parse($project->auction_end_date) : null;
    
            // Check if project is within auction dates
            if ($auctionStartDate && $auctionEndDate) {
                if ($currentDate->lt($auctionStartDate)) {
                    return response()->json([
                        'message' => 'This project is not yet open for investment. Auction starts on ' . $auctionStartDate->format('M d, Y')
                    ], 400);
                }
                
                if ($currentDate->gt($auctionEndDate)) {
                    return response()->json([
                        'message' => 'This project is no longer accepting investments. Auction ended on ' . $auctionEndDate->format('M d, Y')
                    ], 400);
                }
            } else {
                // If no auction dates set, fall back to status check
                if ($project->status !== 'active' && $project->status !== 'funding') {
                    return response()->json([
                        'message' => 'This project is not currently accepting investments'
                    ], 400);
                }
            }
            
            // Verify user exists
            $user = User::where('user_id', $validatedData['user_id'])->first();
            
            if (!$user) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }
            
            // Check if investment amount meets minimum funding goal
            if (floatval($validatedData['amount']) < floatval($project->funding_goal)) {
                return response()->json([
                    'message' => 'Investment amount must be at least equal to the funding goal',
                    'errors' => [
                        'amount' => 'Investment amount must be at least equal to the funding goal of $' . number_format(floatval($project->funding_goal), 2)
                    ]
                ], 422);
            }
            
            // Calculate equity percentage based on investment amount
            $baseEquityPercentage = $validatedData['equity_percentage'] ?? 0;
            
            // Get base equity from project
            if ($project->equity_offered) {
                $baseEquityPercentage = floatval($project->equity_offered);
            } elseif ($project->equity_tiers) {
                // Try to get equity from tiers
                try {
                    $equityTiers = json_decode($project->equity_tiers, true);
                    if (is_array($equityTiers)) {
                        // Find the appropriate tier based on amount
                        foreach ($equityTiers as $tier) {
                            if (floatval($validatedData['amount']) >= floatval($tier['amount'])) {
                                $baseEquityPercentage = floatval($tier['equity_percentage']);
                                break;
                            }
                        }
                    }
                } catch (\Exception $e) {
                    // If error parsing tiers, use provided equity percentage
                }
            }
            
            // Calculate additional equity for amounts over funding goal based on project data
            if (floatval($validatedData['amount']) > floatval($project->funding_goal)) {
                $amountOverFundingGoal = floatval($validatedData['amount']) - floatval($project->funding_goal);
                $fundingGoal = floatval($project->funding_goal);
                
                // Get equity per dollar from project's equity offered and funding goal
                $equityPerDollar = $baseEquityPercentage / $fundingGoal;
                
                // Calculate additional equity based on the same ratio
                $additionalEquity = $equityPerDollar * $amountOverFundingGoal;
                
                $validatedData['equity_percentage'] = $baseEquityPercentage + $additionalEquity;
            } else {
                $validatedData['equity_percentage'] = $baseEquityPercentage;
            }
            
            // Create the investment
            $investment = Investment::create([
                'project_id' => $validatedData['project_id'],
                'user_id' => $validatedData['user_id'],
                'amount' => $validatedData['amount'],
                'equity_percentage' => $validatedData['equity_percentage'],
                'status' => 'pending',
                'payment_method' => $validatedData['payment_method'],
                'investment_notes' => $validatedData['investment_notes'] ?? null,
                'investment_term' => $validatedData['investment_term'],
                'created_at' => now(),
                'updated_at' => now()
            ]);
    
            // Load the relationships
            $investment->load(['project', 'user']);
    
            return response()->json([
                'message' => 'Investment submitted successfully',
                'investment' => $investment
            ], 201);
    
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Investment submission failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified investment.
     */
    public function show($id)
    {
        try {
            $investment = Investment::with(['project', 'user'])->find($id);
            
            if (!$investment) {
                return response()->json([
                    'message' => 'Investment not found'
                ], 404);
            }
            
            return response()->json($investment, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch investment: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified investment in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $investment = Investment::find($id);
            
            if (!$investment) {
                return response()->json([
                    'message' => 'Investment not found'
                ], 404);
            }
            
            // Validate the request
            $validator = Validator::make($request->all(), [
                'amount' => 'nullable|numeric|min:0',
                'equity_percentage' => 'nullable|numeric|between:0,100',
                'status' => 'nullable|string|in:pending,approved,rejected,completed',
                'payment_method' => 'nullable|string|max:50',
                'investment_notes' => 'nullable|string|max:1000',
                'investment_term' => 'nullable|string|in:1-5,5-10,10+',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Check if amount is being updated
            if ($request->has('amount') && $request->amount != $investment->amount) {
                // Get project to recalculate equity
                $project = Project::find($investment->project_id);
                
                if ($project) {
                    // Ensure amount meets minimum
                    if (floatval($request->amount) < floatval($project->funding_goal)) {
                        return response()->json([
                            'message' => 'Investment amount must be at least equal to the funding goal',
                            'errors' => [
                                'amount' => 'Investment amount must be at least equal to the funding goal of $' . number_format(floatval($project->funding_goal), 2)
                            ]
                        ], 422);
                    }
                    
                    // Recalculate equity percentage
                    $baseEquityPercentage = 0;
                    
                    if ($project->equity_offered) {
                        $baseEquityPercentage = floatval($project->equity_offered);
                    } elseif ($project->equity_tiers) {
                        try {
                            $equityTiers = json_decode($project->equity_tiers, true);
                            if (is_array($equityTiers)) {
                                foreach ($equityTiers as $tier) {
                                    if (floatval($request->amount) >= floatval($tier['amount'])) {
                                        $baseEquityPercentage = floatval($tier['equity_percentage']);
                                        break;
                                    }
                                }
                            }
                        } catch (\Exception $e) {
                            // If error parsing tiers, keep existing equity percentage
                            $baseEquityPercentage = $investment->equity_percentage;
                        }
                    }
                    
                    // Calculate additional equity for amounts over funding goal based on project data
                    if (floatval($request->amount) > floatval($project->funding_goal)) {
                        $amountOverFundingGoal = floatval($request->amount) - floatval($project->funding_goal);
                        $fundingGoal = floatval($project->funding_goal);
                        
                        // Get equity per dollar from project's equity offered and funding goal
                        $equityPerDollar = $baseEquityPercentage / $fundingGoal;
                        
                        // Calculate additional equity based on the same ratio
                        $additionalEquity = $equityPerDollar * $amountOverFundingGoal;
                        
                        $investment->equity_percentage = $baseEquityPercentage + $additionalEquity;
                    } else {
                        $investment->equity_percentage = $baseEquityPercentage;
                    }
                }
                
                $investment->amount = $request->amount;
            }
            
            // Update fields if provided
            $fieldList = [
                'payment_method', 'investment_notes', 'investment_term'
            ];
            
            foreach ($fieldList as $field) {
                if ($request->has($field)) {
                    $investment->{$field} = $request->{$field};
                }
            }
            
            // Only update equity percentage directly if not updating amount (to prevent overriding calculated value)
            if ($request->has('equity_percentage') && !$request->has('amount')) {
                $investment->equity_percentage = $request->equity_percentage;
            }
            
            // Handle status changes and timestamps
            if ($request->has('status')) {
                $oldStatus = $investment->status;
                $newStatus = $request->status;
                
                $investment->status = $newStatus;
                
                // Set appropriate timestamps based on status change
                if ($oldStatus != $newStatus) {
                    if ($newStatus == 'approved') {
                        $investment->approved_at = Carbon::now();
                    } else if ($newStatus == 'rejected') {
                        $investment->rejected_at = Carbon::now();
                    } else if ($newStatus == 'completed') {
                        $investment->completed_at = Carbon::now();
                    }
                }
            }
            
            $investment->updated_at = now();
            $investment->save();
            
            // Load the relationships
            $investment->load(['project', 'user']);
            
            return response()->json([
                'message' => 'Investment updated successfully',
                'investment' => $investment
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Investment update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified investment from storage.
     */
    public function destroy($id)
    {
        try {
            $investment = Investment::find($id);
            
            if (!$investment) {
                return response()->json([
                    'message' => 'Investment not found'
                ], 404);
            }
            
            // Don't allow deletion of approved/completed investments
            if (in_array($investment->status, ['approved', 'completed'])) {
                return response()->json([
                    'message' => 'Cannot delete an approved or completed investment'
                ], 400);
            }
            
            // Delete the investment
            $investment->delete();
            
            return response()->json([
                'message' => 'Investment deleted successfully'
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Investment deletion failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all investments for a specific project.
     */
    public function getProjectInvestments($projectId)
    {
        try {
            // Verify project exists
            $project = Project::find($projectId);
            
            if (!$project) {
                return response()->json([
                    'message' => 'Project not found'
                ], 404);
            }

            $investments = Investment::where('project_id', $projectId)
                                  ->with('user')
                                  ->orderBy('created_at', 'desc')
                                  ->get();

            // Calculate total investment amount
            $totalInvestmentAmount = $investments->sum('amount');
            $totalApprovedAmount = $investments->where('status', 'approved')->sum('amount');
            $totalCompletedAmount = $investments->where('status', 'completed')->sum('amount');

            return response()->json([
                'investments' => $investments,
                'total_investment_amount' => $totalInvestmentAmount,
                'total_approved_amount' => $totalApprovedAmount,
                'total_completed_amount' => $totalCompletedAmount,
                'funding_goal' => $project->funding_goal,
                'funding_percentage' => $project->funding_goal > 0 
                    ? round(($totalApprovedAmount + $totalCompletedAmount) / $project->funding_goal * 100, 2)
                    : 0
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch investments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all investments for a specific user.
     */
    public function getUserInvestments($userId)
    {
        try {
            // Verify user exists
            $user = User::where('user_id', $userId)->first();
            
            if (!$user) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }

            $investments = Investment::where('user_id', $userId)
                                  ->with('project')
                                  ->orderBy('created_at', 'desc')
                                  ->get();

            // Calculate investment statistics
            $totalInvestmentAmount = $investments->sum('amount');
            $pendingAmount = $investments->where('status', 'pending')->sum('amount');
            $approvedAmount = $investments->where('status', 'approved')->sum('amount');
            $completedAmount = $investments->where('status', 'completed')->sum('amount');

            return response()->json([
                'investments' => $investments,
                'total_investment_amount' => $totalInvestmentAmount,
                'pending_amount' => $pendingAmount,
                'approved_amount' => $approvedAmount,
                'completed_amount' => $completedAmount,
                'project_count' => $investments->pluck('project_id')->unique()->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch investments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserTransactions($userId)
    {
        try {
            $transactions = Investment::where('user_id', $userId)
                ->with('project:project_id,title')
                ->select('investment_id', 'project_id', 'amount', 'payment_method', 'created_at') 
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($transactions, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch transactions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getProjectsByInvestor($investorId)
    {
        $projects = Investment::with('project') 
            ->where('user_id', $investorId) // Use 'user_id' instead of 'investor_id'
            ->get() // Retrieve all the investments by the investor
            ->pluck('project'); // Extract the project data from the investment

        return response()->json($projects); // Return the projects as JSON
    }
    public function getInvestmentsByInvestor($investorId)
    {
        $investments = Investment::where('user_id', $investorId) // Fetch investments for the investor
            ->get(); // Retrieve all investment records

        return response()->json($investments); // Return investment records as JSON
    }
    public function getInvestorData($investorId)
    {
        $investments = Investment::with('project') // Load related project data
            ->where('user_id', $investorId)
            ->get(); // Retrieve all investments with their projects

        return response()->json($investments); // Return merged data
    }
    public function getProjectTotalInvestment($projectId)
    {
        try {
            // Verify project exists
            $project = Project::find($projectId);

            if (!$project) {
                return response()->json([
                    'message' => 'Project not found'
                ], 404);
            }

            $investments = Investment::where('project_id', $projectId)->get();

            // Calculate total investment amount
            $totalInvestmentAmount = $investments->sum('amount');
            $totalApprovedAmount = $investments->where('status', 'approved')->sum('amount');
            $totalCompletedAmount = $investments->where('status', 'completed')->sum('amount');

            return response()->json([
                'total_amount' => $totalInvestmentAmount,
                'total_approved_amount' => $totalApprovedAmount,
                'total_completed_amount' => $totalCompletedAmount,
                'active_amount' => $totalApprovedAmount + $totalCompletedAmount
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch investment total',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}