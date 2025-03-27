<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class PaymentController extends Controller
{
    /**
     * Generate QR code for payment verification
     */
    public function generateQrCode(Request $request)
    {
        $url = $request->input('url');
        
        // Generate QR code using the SimpleSoftwareIO/QrCode package
        $qrCode = QrCode::format('png')
            ->size(200)
            ->margin(1)
            ->generate($url);
            
        return response($qrCode)->header('Content-Type', 'image/png');
    }
    
    /**
     * Verification page that opens when QR code is scanned
     */
    public function verifyPayment($sessionId)
    {
        return view('payments.verify', ['sessionId' => $sessionId]);
    }
    
    /**
     * Process the verification code
     */
    public function processVerification(Request $request)
    {
        $sessionId = $request->input('session_id');
        $verificationCode = $request->input('verification_code');
        
        // If verification code is "1", mark payment as completed
        if ($verificationCode === "1") {
            // Store payment status in Cache for 15 minutes
            Cache::put('payment_status_' . $sessionId, 'completed', 900);
            
            return response()->json([
                'status' => 'completed',
                'message' => 'Payment verified successfully'
            ]);
        }
        
        // Otherwise mark as failed
        Cache::put('payment_status_' . $sessionId, 'failed', 900);
        
        return response()->json([
            'status' => 'failed',
            'message' => 'Verification failed'
        ]);
    }
    
    /**
     * Manual verification from the React app
     */
    public function manualVerify(Request $request)
    {
        $sessionId = $request->input('session_id');
        $verificationCode = $request->input('verification_code');
        
        if ($verificationCode === "1") {
            Cache::put('payment_status_' . $sessionId, 'completed', 900);
            
            return response()->json([
                'status' => 'completed',
                'message' => 'Payment verified successfully'
            ]);
        }
        
        Cache::put('payment_status_' . $sessionId, 'failed', 900);
        
        return response()->json([
            'status' => 'failed',
            'message' => 'Verification failed'
        ]);
    }
    
    /**
     * Check payment status
     */
    public function checkStatus($sessionId)
    {
        $status = Cache::get('payment_status_' . $sessionId, 'pending');
        
        return response()->json([
            'status' => $status
        ]);
    }
}