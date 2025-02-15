// app/Models/Project.php
<?php



use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $table = 'project';
    
    protected $fillable = [
        'user_id',
        'title',
        'funding_goal',
        'status',
        'project_type',
        'project_des',
        'project_img',
        'reverse_price',
        'project_video'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function projectType()
    {
        return $this->belongsTo(ProjectType::class, 'project_type', 'name');
    }
}