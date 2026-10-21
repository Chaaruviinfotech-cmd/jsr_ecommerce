<?php
require_once 'config.php';

// Auto-migrate schema: ensure logo column exists and is MEDIUMTEXT
@$conn->query("ALTER TABLE company_settings ADD COLUMN IF NOT EXISTS logo MEDIUMTEXT DEFAULT NULL AFTER company_name");
@$conn->query("ALTER TABLE company_settings MODIFY COLUMN logo MEDIUMTEXT DEFAULT NULL");

$method = $_SERVER['REQUEST_METHOD'];

// Handle direct multipart file upload for logo
if ($method === 'POST' && isset($_FILES['logo_file'])) {
    if ($_FILES['logo_file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/uploads/';
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0777, true);
        }
        $fileTmp = $_FILES['logo_file']['tmp_name'];
        $cleanName = preg_replace('/[^a-zA-Z0-9._-]/', '', basename($_FILES['logo_file']['name']));
        $fileName = 'logo_' . time() . '_' . $cleanName;
        $targetPath = $uploadDir . $fileName;
        
        $ext = strtolower(pathinfo($cleanName, PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'];
        if (in_array($ext, $allowed)) {
            if (move_uploaded_file($fileTmp, $targetPath)) {
                $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
                $fileUrl = 'http://' . $host . '/Food%20Marcket/backend/uploads/' . $fileName;
                $escapedUrl = $conn->real_escape_string($fileUrl);
                $conn->query("UPDATE company_settings SET logo = '$escapedUrl' WHERE id = 1");
                sendResponse([
                    'status' => true,
                    'message' => 'Logo uploaded successfully',
                    'url' => $fileUrl
                ]);
            } else {
                sendResponse(['status' => false, 'message' => 'Failed to move uploaded logo file'], 500);
            }
        } else {
            sendResponse(['status' => false, 'message' => 'Invalid file format. Allowed: JPG, PNG, WEBP, SVG, GIF'], 400);
        }
    } else {
        sendResponse(['status' => false, 'message' => 'File upload error code: ' . $_FILES['logo_file']['error']], 400);
    }
}

if ($method === 'GET') {
    $res = $conn->query("SELECT * FROM company_settings WHERE id = 1 LIMIT 1");
    if ($res && $res->num_rows > 0) {
        $settings = $res->fetch_assoc();
        sendResponse([
            'status' => true,
            'data' => [
                'id' => (int)$settings['id'],
                'company_name' => $settings['company_name'] ?? 'JSR Fruit & Vegetable Company',
                'logo' => $settings['logo'] ?? '',
                'tagline' => $settings['tagline'] ?? '',
                'phone' => $settings['phone'] ?? '+91 98270 12345',
                'alternate_phone' => $settings['alternate_phone'] ?? '',
                'email' => $settings['email'] ?? 'care@jsrvegetables.com',
                'address' => $settings['address'] ?? 'Main Market Road, Near Krishi Mandi',
                'city' => $settings['city'] ?? 'Bemetara',
                'state' => $settings['state'] ?? 'Chhattisgarh',
                'pincode' => $settings['pincode'] ?? '491335',
                'gst_number' => $settings['gst_number'] ?? '22AAAAA0000A1Z5',
                'free_delivery_above' => (float)($settings['free_delivery_above'] ?? 300.00),
                'announcement_text' => $settings['announcement_text'] ?? '',
                'whatsapp' => $settings['whatsapp'] ?? '+919827012345',
                'facebook' => $settings['facebook'] ?? '',
                'instagram' => $settings['instagram'] ?? '',
                'updated_at' => $settings['updated_at'] ?? date('Y-m-d H:i:s')
            ]
        ]);
    } else {
        // Create default if missing
        $conn->query("INSERT INTO company_settings (id, company_name, phone, email, address, city, state, pincode) VALUES (1, 'JSR Fruit & Vegetable Company', '+91 98270 12345', 'care@jsrvegetables.com', 'Main Market Road', 'Bemetara', 'Chhattisgarh', '491335')");
        $res = $conn->query("SELECT * FROM company_settings WHERE id = 1 LIMIT 1");
        $settings = $res->fetch_assoc();
        sendResponse(['status' => true, 'data' => $settings]);
    }
} else if ($method === 'POST') {
    $data = getJsonInput();
    
    $companyName = trim($data['company_name'] ?? 'JSR Fruit & Vegetable Company');
    $logo = trim($data['logo'] ?? '');
    $tagline = trim($data['tagline'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $altPhone = trim($data['alternate_phone'] ?? '');
    $email = trim($data['email'] ?? '');
    $address = trim($data['address'] ?? '');
    $city = trim($data['city'] ?? 'Bemetara');
    $state = trim($data['state'] ?? 'Chhattisgarh');
    $pincode = trim($data['pincode'] ?? '491335');
    $gst = trim($data['gst_number'] ?? '');
    $freeDelivery = (float)($data['free_delivery_above'] ?? 300.00);
    $announcement = trim($data['announcement_text'] ?? '');
    $whatsapp = trim($data['whatsapp'] ?? '');
    $facebook = trim($data['facebook'] ?? '');
    $instagram = trim($data['instagram'] ?? '');

    $stmt = $conn->prepare("UPDATE company_settings SET company_name = ?, logo = ?, tagline = ?, phone = ?, alternate_phone = ?, email = ?, address = ?, city = ?, state = ?, pincode = ?, gst_number = ?, free_delivery_above = ?, announcement_text = ?, whatsapp = ?, facebook = ?, instagram = ? WHERE id = 1");
    
    if ($stmt) {
        $stmt->bind_param("sssssssssssdssss", $companyName, $logo, $tagline, $phone, $altPhone, $email, $address, $city, $state, $pincode, $gst, $freeDelivery, $announcement, $whatsapp, $facebook, $instagram);
        $stmt->execute();
        
        sendResponse([
            'status' => true,
            'message' => 'Company settings saved successfully',
            'data' => [
                'id' => 1,
                'company_name' => $companyName,
                'logo' => $logo,
                'tagline' => $tagline,
                'phone' => $phone,
                'alternate_phone' => $altPhone,
                'email' => $email,
                'address' => $address,
                'city' => $city,
                'state' => $state,
                'pincode' => $pincode,
                'gst_number' => $gst,
                'free_delivery_above' => $freeDelivery,
                'announcement_text' => $announcement,
                'whatsapp' => $whatsapp,
                'facebook' => $facebook,
                'instagram' => $instagram
            ]
        ]);
    } else {
        sendResponse(['status' => false, 'message' => 'Failed to prepare update query: ' . $conn->error], 500);
    }
} else {
    sendResponse(['status' => false, 'message' => 'Method not allowed'], 405);
}
?>
