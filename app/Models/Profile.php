<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $table = 'profile';
    protected $primaryKey = 'profile_id';
    public $timestamps = false;
    
    protected $fillable = [
        'profile_id',
        'user_id',
        'contact_info',
        'phone',
        'bio',
        'username'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}