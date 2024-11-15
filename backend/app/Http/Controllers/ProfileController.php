<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProfileController extends Controller
{
    public function updateProfile(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $credentials = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->name = $credentials['name'];
        $user->email = $credentials['email'];
        $user->save();

        return response()->json(['message' => 'Profile updated successfully']);
    }

    // Update user password
    public function updatePassword(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $credentials = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        if (!Hash::check($request->get('current_password'), $user->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 400);
        }

        $user->password = Hash::make($request->get('new_password'));
        $user->save();

        return response()->json(['message' => 'Password updated successfully']);
    }

    // Delete user account
    public function deleteAccount(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $user->delete();

        return response()->json(['message' => 'Account deleted successfully']);
    }
}
