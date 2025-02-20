<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'project_id',
        'title',
        'funding_goal',
        'status',
        'project_type',
        'project_des',
        'project_img',
        'reserve_price',
        'project_categoryId',
    ];
    public function user()
{
    return $this->belongsTo(User::class, 'user_id', 'user_id');
}
}
