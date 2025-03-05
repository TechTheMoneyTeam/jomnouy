<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Investment extends Model
{
    // Specify the table name
    protected $table = 'investment';

    // Specify the primary key
    protected $primaryKey = 'investment_id';

    // Ensure Laravel knows this is not the default 'id'
    public $incrementing = true;

    // Fillable fields for mass assignment
    protected $fillable = [
        'project_id', 
        'user_id', 
        'amount', 
        'status', 
        'investment_date', 
        'equity'
    ];

    // Cast attributes to appropriate types
    protected $casts = [
        'amount' => 'float',
        'investment_date' => 'datetime',
        'equity' => 'integer'
    ];

    // Default values
    protected $attributes = [
        'status' => 'active',
    ];

    // Relationship with Project
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id', 'project_id');
    }

    // Relationship with User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // Scope to filter investments by status
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Calculate total investment for a project
    public static function getTotalInvestmentForProject($projectId): float
    {
        return self::where('project_id', $projectId)->sum('amount');
    }

    // Find top investor for a project
    public static function getTopInvestorForProject($projectId)
    {
        return self::where('project_id', $projectId)
            ->groupBy('user_id')
            ->selectRaw('user_id, SUM(amount) as total_investment')
            ->orderByDesc('total_investment')
            ->first();
    }
}