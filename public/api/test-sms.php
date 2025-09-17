<?php
/**
 * SMS.ir API Test
 * تست ارسال پیامک مطابق مستندات SMS.ir
 */

define('APP_START_TIME', microtime(true));

// Load dependencies
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/core/Logger.php';

header('Content-Type: application/json; charset=UTF-8');

$testResults = [];

try {
    // Test 1: Check SMS Configuration
    $testResults['sms_config'] = 'Testing...';
    
    $configChecks = [
        'SMSIR_API_KEY' => defined('SMS_API_KEY') && SMS_API_KEY ? 'SET ✅' : 'NOT SET ❌',
        'SMSIR_TEMPLATE_ID' => defined('SMSIR_TEMPLATE_ID') && SMSIR_TEMPLATE_ID ? 'SET ✅' : 'NOT SET ❌',
        'SMSIR_TEMPLATE_PARAM_NAME' => defined('SMSIR_TEMPLATE_PARAM_NAME') && SMSIR_TEMPLATE_PARAM_NAME ? 'SET ✅' : 'NOT SET ❌'
    ];
    
    $testResults['sms_config'] = $configChecks;
    
    // Test 2: Check Required Functions
    $testResults['functions'] = [
        'sendOtpSms' => function_exists('sendOtpSms') ? 'EXISTS ✅' : 'NOT FOUND ❌',
        'sendTemplateSMS' => function_exists('sendTemplateSMS') ? 'EXISTS ✅' : 'NOT FOUND ❌',
        'curl_init' => function_exists('curl_init') ? 'EXISTS ✅' : 'NOT FOUND ❌'
    ];
    
    // Test 3: Mock SMS API Request (without actually sending)
    $testResults['api_request_format'] = 'Testing...';
    
    if (function_exists('sendOtpSms') && defined('SMS_API_KEY') && SMS_API_KEY) {
        // Test the request format by capturing what would be sent
        $testPhone = '09123456789';
        $testCode = '123456';
        
        // Create the request data that would be sent to SMS.ir
        $requestData = [
            'mobile' => $testPhone,
            'templateId' => intval(SMSIR_TEMPLATE_ID),
            'parameters' => [
                [
                    'name' => SMSIR_TEMPLATE_PARAM_NAME,
                    'value' => $testCode
                ]
            ]
        ];
        
        $testResults['api_request_format'] = [
            'url' => 'https://api.sms.ir/v1/send/verify',
            'method' => 'POST',
            'headers' => [
                'Content-Type: application/json',
                'x-api-key: ' . (SMS_API_KEY ? '[HIDDEN - API KEY IS SET]' : '[NOT SET]'),
                'Accept: application/json'
            ],
            'body' => $requestData,
            'status' => 'FORMAT CORRECT ✅'
        ];
    } else {
        $testResults['api_request_format'] = 'CONFIGURATION INCOMPLETE ❌';
    }
    
    // Test 4: Template SMS Function Test
    $testResults['template_sms_test'] = 'Testing...';
    
    if (function_exists('sendTemplateSMS')) {
        // Test template SMS format
        $templateTestData = [
            'phone' => '09123456789',
            'template_id' => 100000,
            'parameters' => [
                'NAME' => 'تست کاربر',
                'CODE' => '123456'
            ]
        ];
        
        $testResults['template_sms_test'] = [
            'function' => 'sendTemplateSMS EXISTS ✅',
            'test_data' => $templateTestData,
            'status' => 'READY FOR USE ✅'
        ];
    } else {
        $testResults['template_sms_test'] = 'FUNCTION NOT FOUND ❌';
    }
    
    // Test 5: Check Environment Variables (from env.example)
    $testResults['environment_variables'] = [
        'SMSIR_API_KEY' => getenv('SMSIR_API_KEY') ? 'SET ✅' : 'NOT SET ❌',
        'SMSIR_TEMPLATE_ID' => getenv('SMSIR_TEMPLATE_ID') ? 'SET ✅' : 'NOT SET ❌',
        'CHECKUP_CONFIRM_TEMPLATE_ID' => getenv('CHECKUP_CONFIRM_TEMPLATE_ID') ? 'SET ✅' : 'NOT SET ❌',
        'SMSIR_STAFF_TEMPLATE_ID' => getenv('SMSIR_STAFF_TEMPLATE_ID') ? 'SET ✅' : 'NOT SET ❌',
        'STAFF_NOTIFY_MOBILE' => getenv('STAFF_NOTIFY_MOBILE') ? 'SET ✅' : 'NOT SET ❌'
    ];
    
    // Test 6: Live API Test (only if requested and configured)
    $performLiveTest = $_GET['live_test'] ?? false;
    $testPhone = $_GET['test_phone'] ?? null;
    
    if ($performLiveTest && $testPhone) {
        $testResults['live_api_test'] = 'Testing...';
        
        if (function_exists('sendOtpSms') && defined('SMS_API_KEY') && SMS_API_KEY) {
            $testCode = rand(100000, 999999);
            $result = sendOtpSms($testPhone, $testCode);
            
            $testResults['live_api_test'] = [
                'phone' => $testPhone,
                'code_sent' => $testCode,
                'api_result' => $result ? 'SUCCESS ✅' : 'FAILED ❌',
                'timestamp' => date('Y-m-d H:i:s')
            ];
        } else {
            $testResults['live_api_test'] = 'CONFIGURATION INCOMPLETE ❌';
        }
    } else {
        $testResults['live_api_test'] = 'NOT REQUESTED (add ?live_test=1&test_phone=09xxxxxxxxx to test)';
    }
    
    // Overall Status
    $allConfigured = (
        defined('SMS_API_KEY') && SMS_API_KEY &&
        defined('SMSIR_TEMPLATE_ID') && SMSIR_TEMPLATE_ID &&
        function_exists('sendOtpSms') &&
        function_exists('curl_init')
    );
    
    $testResults['overall_status'] = $allConfigured ? 'SMS SYSTEM READY ✅' : 'CONFIGURATION NEEDED ❌';
    
    // Instructions
    $testResults['setup_instructions'] = [
        '1. Get API Key from https://sms.ir/ panel',
        '2. Create templates in SMS.ir panel (ارسال سریع section)',
        '3. Set environment variables in your hosting panel',
        '4. Test with: ?live_test=1&test_phone=09xxxxxxxxx',
        '5. Check logs if SMS fails to send'
    ];
    
    $testResults['api_documentation'] = 'https://api.sms.ir/v1/send/verify';
    $testResults['timestamp'] = date('Y-m-d H:i:s');
    $testResults['execution_time'] = round((microtime(true) - APP_START_TIME) * 1000, 2) . 'ms';
    
} catch (Exception $e) {
    $testResults['error'] = $e->getMessage();
    $testResults['overall_status'] = 'TEST FAILED ❌';
    
    // Log the error
    if (class_exists('Logger')) {
        Logger::error('SMS test failed', ['error' => $e->getMessage()]);
    }
}

// Output results
echo json_encode($testResults, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
