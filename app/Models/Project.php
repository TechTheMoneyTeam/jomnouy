<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'project_des',
        'funding_goal',
        'reverse_price',
        'project_img',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}