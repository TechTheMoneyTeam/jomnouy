<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $table = 'profile';
    protected $primaryKey = 'profile_id';
    public $timestamps = true;
    
    protected $fillable = [
        'user_id',
        'profile_id',
        'username',
        'bio',
        'location',
        'contact_info',
        'phone',
        'facebook_link',
        'youtube_link',
        'tiktok_link',
        'website',
        'profile_picture'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}