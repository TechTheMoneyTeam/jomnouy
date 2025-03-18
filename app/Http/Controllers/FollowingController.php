<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Follower;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class FollowingController extends Controller
{
    /**
     * Get all users that the authenticated user is following
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFollowing(Request $request)
    {
        try {
            // Get the user ID from the request
            $userId = $request->user_id;

            // Query the followers table to get all users that this user follows
            $following = Follower::where('user_id', $userId)
                ->with(['followed' => function ($query) {
                    $query->select('user_id', 'username')
                          ->with('profile:profile_picture,user_id');
                }])
                ->get()
                ->map(function ($follower) {
                    return [
                        'id' => $follower->followed->user_id,
                        'username' => $follower->followed->username,
                        'profile_picture' => $follower->followed->profile->profile_picture,
                    ];
                });

            return response()->json([
                'success' => true,
                'following' => $following
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching following list',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search for users by username
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function searchUsers(Request $request)
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|min:1',
                'user_id' => 'required|integer' // ID of the user performing the search
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Get search term and user ID
            $searchTerm = $request->username;
            $currentUserId = $request->user_id;

            // Search for users whose username contains the search term
            $users = User::where('username', 'like', '%' . $searchTerm . '%')
                ->with('profile:profile_picture,user_id')
                ->limit(10)
                ->get()
                ->map(function ($user) use ($currentUserId) {
                    $isFollowing = Follower::where('user_id', $currentUserId)
                        ->where('followed_user_id', $user->user_id)
                        ->exists();

                    return [
                        'id' => $user->user_id,
                        'username' => $user->username,
                        'profile_picture' => $user->profile->profile_picture,
                        'isFollowing' => $isFollowing,
                    ];
                });

            return response()->json([
                'success' => true,
                'users' => $users
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error searching for users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Follow a user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function followUser(Request $request)
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|integer', // User who wants to follow
                'followed_user_id' => 'required|integer' // User to be followed
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userId = $request->user_id;
            $followedUserId = $request->followed_user_id;

            // Check if user is trying to follow themselves
            if ($userId === $followedUserId) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot follow yourself'
                ], 400);
            }

            // Check if already following
            $alreadyFollowing = Follower::where('user_id', $userId)
                ->where('followed_user_id', $followedUserId)
                ->exists();

            if ($alreadyFollowing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Already following this user'
                ], 400);
            }

            // Create new follower relationship
            Follower::create([
                'user_id' => $userId,
                'followed_user_id' => $followedUserId,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Successfully followed user'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error following user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Unfollow a user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function unfollowUser(Request $request)
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|integer', // User who wants to unfollow
                'followed_user_id' => 'required|integer' // User to be unfollowed
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userId = $request->user_id;
            $followedUserId = $request->followed_user_id;

            // Delete the follower relationship
            $deleted = Follower::where('user_id', $userId)
                ->where('followed_user_id', $followedUserId)
                ->delete();

            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not following this user'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Successfully unfollowed user'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error unfollowing user',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}