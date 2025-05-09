<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $primaryKey = 'user_id';
    public $timestamps = true;
    
    protected $fillable = [
        'username',
        'user_id',
        'first_name',
        'last_name',
        'email',
        'user_type',
        'password',
        'user_type'
    ];

    public function profile()
    {
        return $this->hasOne(Profile::class, 'user_id', 'user_id');
    }
    public function projects()
{
    return $this->hasMany(Project::class, 'user_id', 'user_id');
}
}