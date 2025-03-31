<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Update extends Model
{
               use HasFactory, SoftDeletes; // Using SoftDeletes trait

               protected $fillable = [
                              'project_id',
                              'title',
                              'description',
                              'update_date',
                              'file_path'
               ];

               // Relationship with Project
               public function project()
               {
                              return $this->belongsTo(Project::class, 'project_id', 'project_id');
               }

               // Accessor for formatted update date
               public function getFormattedUpdateDateAttribute()
               {
                              return \Carbon\Carbon::parse($this->update_date)->format('Y-m-d');
               }
}