<?php

namespace App\Http\Controllers;

use App\Models\KycVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KycVerificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = $request->input('user_id');
        
        $kycVerification = KycVerification::where('user_id', $userId)->first();
        
        return response()->json([
            'success' => true,
            'data' => $kycVerification,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'full_name' => 'required|string|max:255',
            'government_id' => 'required|string|max:255',
            'id_number' => 'required|string|max:255',
            'address_proof' => 'required|string|max:255',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'country' => 'required|string|max:255',
            'tax_id_number' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Create new KYC verification
        $kycVerification = KycVerification::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'KYC verification submitted successfully',
            'data' => $kycVerification,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $kycVerification = KycVerification::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $kycVerification,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $kycVerification = KycVerification::findOrFail($id);

        // Validate the request
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'full_name' => 'required|string|max:255',
            'government_id' => 'required|string|max:255',
            'id_number' => 'required|string|max:255',
            'address_proof' => 'required|string|max:255',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'country' => 'required|string|max:255',
            'tax_id_number' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $kycVerification->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'KYC verification updated successfully',
            'data' => $kycVerification,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $kycVerification = KycVerification::findOrFail($id);
        $kycVerification->delete();

        return response()->json([
            'success' => true,
            'message' => 'KYC verification deleted successfully',
        ]);
    }
}