<?php
require_once 'config.php';

$data = getRequestBody();
$phone = trim($data['mobile'] ?? ($data['phone'] ?? ''));
$email = trim($data['email'] ?? '');
$message = trim($data['message'] ?? '');

sendResponse([
    'status' => true,
    'message' => 'Thank you for connecting with JSR Fruit & Vegetable Company! We will update you shortly.'
]);
?>
