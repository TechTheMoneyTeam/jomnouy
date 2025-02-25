<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Carbon;
use App\Models\User;

class PasswordResetController extends Controller
{
    public function sendResetEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return response()->json([
                'message' => 'We could not find a user with that email address.'
            ], 404);
        }

        // Generate a reset request timestamp
        $user->password_reset_requested_at = Carbon::now();
        $user->save();

        // We're not using tokens here - just sending an email
        Mail::send('emails.password_reset', ['email' => $request->email], function($message) use ($request) {
            $message->to($request->email);
            $message->subject('Reset Your Password');
        });

        return response()->json(['message' => 'Reset instructions have been sent to your email']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        // Find user and check if they requested a password reset
        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        
        // Check if a reset was requested for this email
        if (!$user->password_reset_requested_at) {
            return response()->json(['message' => 'No password reset request found for this email'], 400);
        }

        // Update password
        $user->password = bcrypt($request->password);
        
        // Clear the password reset request timestamp
        $user->password_reset_requested_at = null;
        
        $user->save();

        return response()->json(['message' => 'Password has been reset successfully']);
    }
}