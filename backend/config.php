<?php
// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight OPTIONS request
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$localhost = "127.0.0.1";
$username = "root";
$password = "";
$database = "food_marcket";

$conn = @new mysqli($localhost, $username, $password, $database);
if ($conn->connect_error) {
    // Retry with socket or localhost fallback
    $conn = @new mysqli("localhost", $username, $password, $database, 3306, "/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock");
}
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'status' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit();
}

$conn->set_charset("utf8mb4");

// Helper to send json response
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit();
}

// Helper to get JSON request body
function getRequestBody() {
    $raw = file_get_contents('php://input');
    if (!empty($raw)) {
        $decoded = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            return $decoded;
        }
    }
    return $_POST;
}

// Alias for getJsonInput
function getJsonInput() {
    return getRequestBody();
}
?>