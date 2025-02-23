<?php


namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function getProfile(Request $request)
    {
        try {
            $username = $request->query('username');
            $profile = Profile::where('username', $username)->first();
            
            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profile not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'profile' => [
                    'name' => $profile->name,
                    'bio' => $profile->bio,
                    'location' => $profile->location,
                    'facebook_link' => $profile->facebook_link,
                    'youtube_link' => $profile->youtube_link,
                    'tiktok_link' => $profile->tiktok_link,
                    'website' => $profile->website,
                    'profile_picture' => $profile->profile_picture
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching profile'
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $profile = Profile::where('username', $request->username)->first();
            
            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profile not found'
                ], 404);
            }

            // Handle profile picture upload
            if ($request->hasFile('profile_picture')) {
                if ($profile->profile_picture) {
                    Storage::disk('public')->delete($profile->profile_picture);
                }
                $path = $request->file('profile_picture')->store('profile-pictures', 'public');
                $profile->profile_picture = $path;
            }

            // Update profile fields
            $profile->name = $request->name ?? $profile->name;
            $profile->bio = $request->biography ?? $profile->bio;
            $profile->location = $request->location ?? $profile->location;
            $profile->facebook_link = $request->facebookLink ?? $profile->facebook_link;
            $profile->youtube_link = $request->youtubeLink ?? $profile->youtube_link;
            $profile->tiktok_link = $request->tiktokLink ?? $profile->tiktok_link;
            $profile->website = $request->website ?? $profile->website;
            
            $profile->save();

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'profile' => $profile
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating profile'
            ], 500);
        }
    }
}