<?php
require_once 'config.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	http_response_code(200);
	exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
	http_response_code(405);
	echo json_encode(['error' => 'method not allowed']);
	exit();
}

$target = '';
if (!empty($_GET['u'])) {
	$decoded = base64_decode($_GET['u'], true);
	if ($decoded !== false) { $target = $decoded; }
}
if (!$target) {
	$target = $_GET['url'] ?? '';
}
if (!$target || !preg_match('#^https?://#i', $target)) {
	http_response_code(400);
	echo json_encode(['error' => 'invalid url']);
	exit();
}

// بررسی امنیت: فقط اجازه به دامنه cms.salamatlab.com و مسیر wp-json
$check = strtolower($target);
if (strpos($check, 'cms.salamatlab.com') === false || strpos($check, '/wp-json/') === false) {
	http_response_code(400);
	echo json_encode(['error' => 'forbidden domain or path']);
	exit();
}

// --- Start Debug Logging ---
function write_log($message) {
	$logFile = __DIR__ . '/wp-proxy.log';
	$timestamp = date('Y-m-d H:i:s');
	@file_put_contents($logFile, "[$timestamp] " . $message . "\n", FILE_APPEND);
}
write_log("Request received for target: " . $target);
// --- End Debug Logging ---

$contextOptions = [
	'http' => [
		'method' => 'GET',
		'header' => "Accept: application/json\r\n" .
					"User-Agent: SalamatLab-Proxy/1.1\r\n",
		'ignore_errors' => true
	],
	'ssl' => [
		'verify_peer' => false,
		'verify_peer_name' => false,
	]
];

function fetch_with_headers($url, $contextOptions) {
	$context = stream_context_create($contextOptions);
	$body = @file_get_contents($url, false, $context);
	$hdrs = $GLOBALS['http_response_header'] ?? [];
	$statusLine = $hdrs[0] ?? 'HTTP/1.1 500 Internal Server Error';
	preg_match('{HTTP\/\S*\s(\d{3})}', $statusLine, $m);
	$code = isset($m[1]) ? intval($m[1]) : 500;
	return [$code, $hdrs, $body];
}

function curl_fetch($url) {
	$headers = [
		'Accept: application/json',
		'User-Agent: SalamatLab-Proxy/1.1'
	];
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
	$body = curl_exec($ch);
	$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	return [$code ?: 0, [], $body];
}

function get_location_header($headers) {
	foreach ($headers as $h) {
		if (stripos($h, 'Location:') === 0) {
			return trim(substr($h, 9));
		}
	}
	return null;
}

function is_allowed_url($url) {
	$u = strtolower($url);
	return (strpos($u, 'cms.salamatlab.com') !== false) && (strpos($u, '/wp-json/') !== false);
}

$maxRedirects = 5;
$currentUrl = $target;
$responseHeaders = [];
$responseBody = '';
$statusCode = 0;

for ($i = 0; $i <= $maxRedirects; $i++) {
	list($statusCode, $responseHeaders, $responseBody) = fetch_with_headers($currentUrl, $contextOptions);
	write_log("Fetch try #$i: code=$statusCode url=$currentUrl");
	if (in_array($statusCode, [301, 302, 307, 308], true)) {
		$location = get_location_header($responseHeaders);
		if (!$location) { break; }
		// Resolve relative redirects
		if (strpos($location, 'http') !== 0) {
			$parsed = parse_url($currentUrl);
			$scheme = $parsed['scheme'] ?? 'https';
			$host = $parsed['host'] ?? '';
			$port = isset($parsed['port']) ? ':' . $parsed['port'] : '';
			$base = $scheme . '://' . $host . $port;
			if (isset($location[0]) && $location[0] !== '/') {
				$path = rtrim(dirname($parsed['path'] ?? '/'), '/') . '/';
				$location = $base . $path . $location;
			} else {
				$location = $base . $location;
			}
		}
		if (!is_allowed_url($location)) {
			write_log("Blocked redirect to: $location");
			break;
		}
		$currentUrl = $location;
		continue;
	}
	break;
}

// If failed or not 2xx, try cURL fallback
if ($responseBody === false || $statusCode < 200 || $statusCode >= 400) {
	write_log("Stream failed or non-2xx ($statusCode). Trying cURL...");
	list($statusCode, $responseHeaders, $responseBody) = curl_fetch($currentUrl);
}

if ($responseBody === false || $responseBody === null || $statusCode === 0) {
	$error = error_get_last();
	write_log("Final failure. Error: " . ($error['message'] ?? 'Unknown error'));
	http_response_code(502);
	echo json_encode([
		'error' => 'bad gateway',
		'details' => 'Failed to fetch data',
		'url' => $currentUrl
	]);
	exit();
}

write_log("Final response code: $statusCode. Body starts with: " . substr($responseBody, 0, 200));

$hasContentType = false;
foreach ($responseHeaders as $hdr) {
	if (stripos($hdr, 'Content-Type:') === 0) {
		$hasContentType = true;
		header($hdr);
	}
	if (stripos($hdr, 'X-WP-Total:') === 0 || stripos($hdr, 'X-WP-TotalPages:') === 0) {
		header($hdr);
	}
}
if (!$hasContentType) {
	header('Content-Type: application/json; charset=utf-8');
}

http_response_code($statusCode);
echo $responseBody;
exit();
?>


