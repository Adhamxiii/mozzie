<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Registrt API (name, email, password, confirm_password)
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create($data);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'status' => true,
        ], 201);
    }

    // Login API (email, password)
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid login credentials',
                'status' => false,
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('myToken')->plainTextToken;

        return response()->json([
            'message' => 'User logged in successfully',
            'user' => $user,
            'token' => $token,
            'status' => true,
        ], 200);
    }

    // Profile API  
    public function profile(Request $request)
    {
        $user = Auth::user();
        return response()->json([
            'message' => 'User profile retrieved successfully',
            'user' => $user,
            'status' => true,
        ], 200);
    }
    
    // Logout API
    public function logout(Request $request)
    {
        Auth::logout();

        return response()->json([
            'message' => 'User logged out successfully',
            'status' => true,
        ], 200);
    }
}
