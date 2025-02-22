<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log; 

class UserController extends Controller
{
    public function signup(Request $request)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|max:50|unique:users',
                'first_name' => 'required|string|max:50',
                'last_name' => 'required|string|max:50',
                'email' => 'required|email|max:50|unique:users',
                'password' => 'required|string|min:6',
                'phone' => 'nullable|string|max:15',
                'contact_info' => 'nullable|string|max:255',
                'bio' => 'nullable|string|max:1000',
                'user_type' => 'nullable|string|in:investor,entrepreneur,startup'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validatedData = $validator->validated();
    
            // Find the next available user_id between 1 and 1064
            $userId = null;
            $existingIds = User::pluck('user_id')->toArray();
            
            for ($i = 1; $i <= 1064; $i++) {
                if (!in_array($i, $existingIds)) {
                    $userId = $i;
                    break;
                }
            }
            
            // Check if we found an available ID
            if ($userId === null) {
                throw new \Exception('No available user IDs remaining');
            }

            // Generate profile_id
            $profileId = $userId;
             
             // Using the same ID for profile_id
    
            // Create user with hashed password
            $user = User::create([
                'user_id' => $userId,
                'username' => $validatedData['username'],
                'profile_id' => $profileId,
                'first_name' => $validatedData['first_name'],
                'last_name' => $validatedData['last_name'],
                'email' => $validatedData['email'],
                'user_type' => 'user',
                'password' => Hash::make($validatedData['password']),
                'user_type' => $validatedData['user_type'] ?? null,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            $userName = $validatedData['username'];
    
            // Create profile with the same ID
            $profile = Profile::create([
                'user_id' => $userId,
                'profile_id' => $profileId,
                'username' => $userName,
                'contact_info' => $validatedData['contact_info'] ?? '',
                'phone' => $validatedData['phone'] ?? '',
                'bio' => $validatedData['bio'] ?? '',
                
            ]);
    
            // Remove password from response
            $user = $user->makeHidden(['password']);
    
            return response()->json([
                'message' => 'User created successfully',
                'user' => $user
            ], 201);
    
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Signup failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function login(Request $request)
    {
        // Validate login request
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Find user by email
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Remove password from response
        $user = $user->makeHidden(['password']);

        return response()->json([
            'message' => 'Login successful',
            'user' => $user
        ]);
    }
    public function getProfileByUsername($username)
    {
        try {
            // Debug the incoming username
            Log::info('Fetching profile for username: ' . $username);
    
            // Find user by username
            $user = User::where('username', $username)
                ->first();
    
            if (!$user) {
                return response()->json([
                    'message' => 'User not found',
                    'error' => 'No user found with username: ' . $username
                ], 404);
            }
    
            // Get the associated profile
            $profile = Profile::where('username', $username)->first();
    
            if (!$profile) {
                return response()->json([
                    'message' => 'Profile not found',
                    'error' => 'No profile found for username: ' . $username
                ], 404);
            }
    
            // Combine user and profile data, selecting only needed fields
            $profileData = [
                'id' => $user->user_id,
                'username' => $user->username,
                'profile_id' => $profile->profile_id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'user_type' => $user->user_type,
                'phone' => $profile->phone,
                'contact_info' => $profile->contact_info,
                'bio' => $profile->bio
            ];
    
            return response()->json($profileData);
    
        } catch (\Exception $e) {
            Log::error('Profile fetch error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function updateProfile(Request $request, $userId)
{
    try {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:50',
            'last_name' => 'sometimes|string|max:50',
            'email' => 'sometimes|email|max:50|unique:users,email,'.$userId.',user_id',
            'phone' => 'nullable|string|max:15',
            'contact_info' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'user_type' => 'nullable|string|in:investor,entrepreneur,startup'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Find user
        $user = User::where('user_id', $userId)->first();
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        // Find profile
        $profile = Profile::where('user_id', $userId)->first();
        if (!$profile) {
            return response()->json([
                'message' => 'Profile not found'
            ], 404);
        }

        // Update user fields
        if ($request->has('first_name')) {
            $user->first_name = $request->first_name;
        }
        if ($request->has('last_name')) {
            $user->last_name = $request->last_name;
        }
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        if ($request->has('user_type')) {
            $user->user_type = $request->user_type;
        }
        $user->save();

        // Update profile fields
        if ($request->has('phone')) {
            $profile->phone = $request->phone;
        }
        if ($request->has('contact_info')) {
            $profile->contact_info = $request->contact_info;
        }
        if ($request->has('bio')) {
            $profile->bio = $request->bio;
        }
        $profile->save();

        // Get updated profile data
        $profileData = array_merge(
            $user->makeHidden(['password'])->toArray(),
            $profile->toArray()
        );

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $profileData
        ]);

    } catch (\Exception $e) {
        \Log::error('Profile update error: ' . $e->getMessage());
        return response()->json([
            'message' => 'Failed to update profile',
            'error' => $e->getMessage()
        ], 500);
    }
}
 
    public function updateUserType(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'nullable|exists:users,username',
                'user_type' => 'required|in:investor,entrepreneur,startup'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::where('username', $request->username)->first();
            $user->user_type = $request->user_type;
            $user->save();

            return response()->json([
                'message' => 'User type updated successfully',
                'user' => $user->makeHidden(['password'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update user type',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}