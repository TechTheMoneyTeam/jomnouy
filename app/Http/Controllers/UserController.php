<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

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
            $profileId = $userId; // Using the same ID for profile_id
    
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
                'user_type' => $validatedData['user_type'] ?? null
            ]);
    
            // Create profile with the same ID
            $profile = Profile::create([
                'user_id' => $userId,
                'profile_id' => $profileId, // Make sure this matches the user's profile_id
                'contact_info' => $validatedData['contact_info'] ?? '',
                'phone' => $validatedData['phone'] ?? '',
                'bio' => $validatedData['bio'] ?? ''
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

    public function getProfile($userId)
    {
        $user = User::with('profile')
            ->where('user_id', $userId)
            ->first();
        
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        // Remove password from response
        $user = $user->makeHidden(['password']);

        return response()->json([
            'user' => $user
        ]);
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
