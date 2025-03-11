<!-- resources/views/payments/verify.blade.php -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f5f5f5;
        }
        .verification-container {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 90%;
            text-align: center;
        }
        h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .input-group {
            margin-bottom: 20px;
        }
        input {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
        }
        button:hover {
            background-color: #45a049;
        }
        .success-message {
            color: #4CAF50;
            margin-top: 20px;
            font-weight: bold;
            display: none;
        }
        .error-message {
            color: #f44336;
            margin-top: 20px;
            font-weight: bold;
            display: none;
        }
    </style>
</head>
<body>
    <div class="verification-container">
        <h1>Payment Verification</h1>
        <p>Please enter the verification code to complete your payment.</p>
        
        <form id="verificationForm">
            @csrf
            <input type="hidden" name="session_id" value="{{ $sessionId }}">
            
            <div class="input-group">
                <input type="text" id="verificationCode" name="verification_code" placeholder="Enter verification code" required>
            </div>
            
            <button type="submit">Verify Payment</button>
        </form>
        
        <div id="successMessage" class="success-message">
            Payment verified successfully! You can close this page.
        </div>
        
        <div id="errorMessage" class="error-message">
            Verification failed. Please try again.
        </div>
    </div>

    <script>
        document.getElementById('verificationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const sessionId = formData.get('session_id');
            const verificationCode = document.getElementById('verificationCode').value;
            
            // Send verification to Laravel backend
            fetch('/api/payments/process-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    verification_code: verificationCode
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'completed') {
                    document.getElementById('successMessage').style.display = 'block';
                    document.getElementById('errorMessage').style.display = 'none';
                    document.getElementById('verificationForm').style.display = 'none';
                } else {
                    document.getElementById('errorMessage').style.display = 'block';
                    document.getElementById('successMessage').style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('errorMessage').style.display = 'block';
                document.getElementById('successMessage').style.display = 'none';
            });
        });
    </script>
</body>
</html>