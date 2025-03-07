<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $primaryKey = 'project_id';
    
    // We're not using auto-incrementing IDs since we're generating them manually
    public $incrementing = false;
    
    protected $fillable = [
        'project_id',
        'user_id',
        'title',
        'funding_goal',
        'project_type',
        'project_des',
        'project_story',
        'project_img',
        'project_video',
        'reserve_price',
        'categories',
        'project_location',
        'status',
        'auction_start_date',
        'auction_end_date',
        'member_name',
        'member_position',
        // New equity fields
        'equity_offered',
        'equity_tiers',
        'return_1_5_years',
        'return_5_10_years',
        'return_10_plus_years',
        'created_at',
        'updated_at'
    ];
    
    protected $with = ['user'];
    
    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'equity_tiers' => 'json',
        'equity_offered' => 'float',
        'return_1_5_years' => 'float',
        'return_5_10_years' => 'float',
        'return_10_plus_years' => 'float',
    ];

    /**
     * Get the user that owns the project
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * Get the full URL for project image
     */
    public function getProjectImgUrlAttribute()
    {
        if (!$this->project_img) {
            return null;
        }
        return url('storage/' . $this->project_img);
    }

    /**
     * Get the full URL for project video
     */
    public function getProjectVideoUrlAttribute()
    {
        if (!$this->project_video) {
            return null;
        }
        return url('storage/' . $this->project_video);
    }

    /**
     * Get the attributes that should be appended to array forms of the model.
     *
     * @var array
     */
    protected $appends = ['project_img_url', 'project_video_url'];
}