<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
               public function Save(Request $request)
               {
                              // Remove validation for testing
                              $user = User::create([
                                             'user_id' => $request->user_id,
                                             'username' => $request->username,
                                             'first_name' => $request->first_name,
                                             'last_name' => $request->last_name,
                                             'profile_id' => $request->profile_id,
                                             'email' => $request->email,
                                             'user_type' => $request->user_type,
                                             'password' => Hash::make($request->password)
                              ]);

                              return response()->json(['message' => 'User registered successfully!', 'user' => $user], 201);
               }
               public function Login(Request $request)
               {
                              // Validate the input data
                              $validated = $request->validate([
                                             'email' => 'required|email',
                                             'password' => 'required|min:6', // adjust the password rule as needed
                              ]);

                              // Check if the user exists
                              $user = User::where('email', $request->email)->first();

                              // If the user doesn't exist or password is incorrect
                              if (!$user || !Hash::check($request->password, $user->password)) {
                                             return response()->json(['message' => 'Invalid credentials'], 401);
                              }

                              // Here you can generate a token if you're using JWT or session
                              // For simplicity, I'm assuming you're using basic authentication
                              // In a real scenario, you'd probably use something like JWT to authenticate API requests.

                              return response()->json([
                                                            'message' => 'Login successful',
                                                            'user' => $user,
                                                            // If you're using JWT, you would return the token here
                                                            // 'token' => $user->createToken('YourAppName')->plainTextToken,
                                             ]);
               }


}
