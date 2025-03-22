<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class Investment extends Model
{
    // Table name
    protected $table = 'investment';

    // Primary key
    protected $primaryKey = 'investment_id';

    // Incrementing primary key
    public $incrementing = true;

    // Fillable fields
    protected $fillable = [
        'project_id', 
        'user_id', 
        'amount', 
        'total_amount', 
        'status', 
        'investment_date', 
        'equity'
    ];

    // Attribute casting
    protected $casts = [
        'amount' => 'float',
        'total_amount' => 'float',
        'investment_date' => 'datetime',
        'equity' => 'float'
    ];

    // Default attributes
    protected $attributes = [
        'status' => 'active',
    ];

    // Relationships
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id', 'project_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Calculate total investment for a project
     *
     * @param int $projectId
     * @return float
     */
    public static function calculateTotalInvestment(int $projectId): float
    {
        return self::where('project_id', $projectId)
            ->where('status', 'active')
            ->sum('amount');
    }

    /**
     * Calculate total number of investors
     *
     * @param int $projectId
     * @return int
     */
    public static function calculateTotalInvestors(int $projectId): int
    {
        return self::where('project_id', $projectId)
            ->where('status', 'active')
            ->distinct('user_id')
            ->count('user_id');
    }

    /**
     * Find top investor for a project
     *
     * @param int $projectId
     * @return User|null
     */
    public static function findTopInvestor(int $projectId)
    {
        $topInvestor = self::where('project_id', $projectId)
            ->where('status', 'active')
            ->select('user_id', DB::raw('SUM(amount) as total_investment'))
            ->groupBy('user_id')
            ->orderByDesc('total_investment')
            ->first();

        return $topInvestor ? User::find($topInvestor->user_id) : null;
    }

    /**
     * Update project investment statistics
     *
     * @param int $projectId
     * @return void
     */
    public static function updateProjectInvestmentStats(int $projectId)
    {
        $project = Project::findOrFail($projectId);

        // Calculate investment metrics
        $totalInvestment = self::calculateTotalInvestment($projectId);
        $totalInvestors = self::calculateTotalInvestors($projectId);
        $topInvestor = self::findTopInvestor($projectId);

        // Update project with investment statistics
        $project->update([
            'total_invested' => $totalInvestment,
            'total_investors' => $totalInvestors,
            'top_investor_id' => $topInvestor ? $topInvestor->user_id : null
        ]);
    }

    /**
     * Prepare total amount before saving
     *
     * @param int $projectId
     * @return float
     */
    public function prepareTotalAmount(int $projectId): float
    {
        return self::where('project_id', $projectId)
            ->where('status', 'active')
            ->sum('amount') + $this->amount;
    }

    /**
     * Trigger investment stats update after investment creation or update
     */
    protected static function booted()
    {
        // Update total amount and project stats when a new investment is created
        static::creating(function ($investment) {
            $investment->total_amount = $investment->prepareTotalAmount($investment->project_id);
        });

        // Update project stats when a new investment is created
        static::created(function ($investment) {
            self::updateProjectInvestmentStats($investment->project_id);
        });

        // Update project stats when an investment is updated
        static::updated(function ($investment) {
            self::updateProjectInvestmentStats($investment->project_id);
        });
    }
}