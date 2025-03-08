<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class SettingsController extends Controller
{
    public function getSettings(Request $request)
    {
        try {
            $username = $request->query('username');
            $user = User::where('username', $username)
                       ->select('email', 'username')
                       ->first();

            if (!$user) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }

            return response()->json([
                'message' => 'Settings retrieved successfully',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function changePassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|string',
                'current_password' => 'required|string',
                'new_password' => ['required', 'string', 'confirmed', Password::min(6)],
                'new_password_confirmation' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::where('username', $request->username)->first();

            if (!$user) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }

            // Verify current password
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect'
                ], 401);
            }

            // Update password
            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                'message' => 'Password updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update password',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function changePassword1(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',  // Require email instead of username
                'new_password' => ['required', 'string', 'confirmed', Password::min(6)],
                'new_password_confirmation' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::where('email', $request->email)->first();  // Find user by email

            if (!$user) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }

            // Update password
            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                'message' => 'Password updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update password',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}