<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    protected $table = 'users'; // Define table name explicitly

    protected $primaryKey = 'user_id'; // Set primary key

    public $timestamps = false; // Enable timestamps

    protected $fillable = ['user_id', 'username', 'first_name', 'last_name', 'profile_id', 'email', 'user_type', 'password'];

    protected $hidden = ['password']; // Hide password from JSON responses

    // public $incrementing = false; // Set to false if the primary key is not auto-incrementing
}
