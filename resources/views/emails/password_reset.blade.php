<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Reset Your Password</title>
    <style>
        body {
            text-align: center;
            background-color: #f4f4f4;
            padding: 20px;
        }

        .container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            margin: auto;
        }

        .btn {
            background-color: #F07900;
            /* Orange color */
            color: white;
            padding: 14px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            border-radius: 4px;
            font-size: 16px;
        }

        p {
            color: #333;
        }

        .container .eng {
            font-family: 'Main-Font', sans-serif;
        }

        .container .kh {
            font-family: 'khmerFont', sans-serif;

        }

        .logo {
            font-family: 'Main-Font', sans-serif;
            font-size: 48px;
            font-weight: bold;
        }

        .first-part {
            color: #000000;
        }

        .second-part {
            color: #FF8C00;
        }

        @font-face {
            font-family: 'Main-Font';
            src: url('./font/Montserrat-VariableFont_wght.ttf')
        }

        @font-face {
            font-family: 'khmerFont';
            src: url('./font/Siemreap-Regular.ttf')
        }

        .btn .eng {
            font-family: 'Main-Font', sans-serif;
        }

        .btn .eng .kh {
            font-family: 'khmerFont', sans-serif;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="logo">
            <span class="first-part">JOM-</span><span class="second-part">NOUY</span>
        </div>
        <h1 class="eng">Reset Your Password</h1>
        <h2 class="kh">ផ្លាស់ប្តូរពាក្យសម្ងាត់របស់អតិថិជន</h2>
        <p class="eng">You are receiving this email because we received a password reset request for your account.</p>
        <p class="kh">អ្នកកំពុងទទួលអ៊ីមែលនេះ ព្រោះយើងបានទទួលសំណើផ្លាស់ប្តូរពាក្យសម្ងាត់សម្រាប់គណនីរបស់អតិថិជន។</p>
        <p class="eng">Click the button below to reset your password:</p>
        <p class="kh">សូមចុចប៊ូតុងខាងក្រោម ដើម្បីផ្លាស់ប្តូរពាក្យសម្ងាត់របស់អ្នក៖</p>
        <a href="http://localhost:8000/reset" class="btn"><span class="eng">Reset Password | <span class="kh">ផ្លាស់ប្តូរពាក្យសម្ងាត់</span></a>
        <p class="eng">If you did not request a password reset, no further action is required.</p>
        <p class="kh">ប្រសិនបើអ្នកមិនបានស្នើសុំផ្លាស់ប្តូរពាក្យសម្ងាត់ទេ មិនចាំបាច់ធ្វើអ្វីបន្ថែមទៀតឡើយ។</p>
    </div>
</body>

</html>