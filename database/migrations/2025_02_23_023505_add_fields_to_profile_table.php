<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('profile', function (Blueprint $table) {
            // Add new columns
            if (!Schema::hasColumn('profile', 'name')) {
                $table->string('name')->nullable();
            }
            if (!Schema::hasColumn('profile', 'location')) {
                $table->string('location')->nullable();
            }
            if (!Schema::hasColumn('profile', 'facebook_link')) {
                $table->string('facebook_link')->nullable();
            }
            if (!Schema::hasColumn('profile', 'youtube_link')) {
                $table->string('youtube_link')->nullable();
            }
            if (!Schema::hasColumn('profile', 'tiktok_link')) {
                $table->string('tiktok_link')->nullable();
            }
            if (!Schema::hasColumn('profile', 'website')) {
                $table->string('website')->nullable();
            }
            if (!Schema::hasColumn('profile', 'profile_picture')) {
                $table->string('profile_picture')->nullable();
            }
            
            // Modify existing bio column to increase length
            $table->text('bio', 1000)->change();
        });
    }

    public function down()
    {
        Schema::table('profile', function (Blueprint $table) {
            $table->dropColumn([
                'name',
                'location',
                'facebook_link',
                'youtube_link',
                'tiktok_link',
                'website',
                'profile_picture'
            ]);
            // Revert bio back to original size if needed
            $table->string('bio', 500)->change();
        });
    }
};