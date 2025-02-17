<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectType extends Model
{
    use HasFactory;

    protected $table = 'project_type';
    public $timestamps = false;

    protected $fillable = ['name'];

    public function projects()
    {
        return $this->hasMany(Project::class, 'project_type_id');
    }
}