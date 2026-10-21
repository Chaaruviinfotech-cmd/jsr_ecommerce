<?php
require_once 'config.php';

$action = $_GET['action'] ?? '';
$data = getJsonInput();

switch ($action) {
    case 'login':
        $identifier = trim($data['identifier'] ?? '');
        $password = trim($data['password'] ?? '');

        if (empty($identifier)) {
            sendResponse(['status' => false, 'message' => 'Please provide your email or mobile number.'], 400);
        }
        if (empty($password)) {
            sendResponse(['status' => false, 'message' => 'Please enter your password.'], 400);
        }

        // Check strictly in customers table
        $stmt = $conn->prepare("SELECT * FROM customers WHERE email = ? OR mobile = ? LIMIT 1");
        $stmt->bind_param("ss", $identifier, $identifier);
        $stmt->execute();
        $res = $stmt->get_result();

        if ($res && $res->num_rows > 0) {
            $customer = $res->fetch_assoc();
            
            // If customer has a password set, verify it
            if (!empty($customer['password'])) {
                $isPasswordValid = password_verify($password, $customer['password']) || ($password === $customer['password']);
                if (!$isPasswordValid) {
                    sendResponse(['status' => false, 'message' => 'Invalid password. Please check and try again.'], 401);
                }
            } else {
                // If existing legacy customer has no password set yet, set this password for their account
                $hashed = password_hash($password, PASSWORD_DEFAULT);
                $up = $conn->prepare("UPDATE customers SET password = ? WHERE id = ?");
                $up->bind_param("si", $hashed, $customer['id']);
                $up->execute();
            }

            sendResponse([
                'status' => true,
                'message' => 'Login successful',
                'data' => [
                    'id' => (int)$customer['id'],
                    'name' => $customer['name'],
                    'email' => $customer['email'] ?? '',
                    'phone' => $customer['mobile'],
                    'address' => $customer['address'] ?? '',
                    'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                    'total_orders' => (int)$customer['total_orders'],
                    'total_spend' => (float)$customer['total_spend'],
                    'joinDate' => substr($customer['created_at'] ?? date('Y-m-d'), 0, 10)
                ]
            ]);
        } else {
            sendResponse([
                'status' => false,
                'message' => 'No account found with this email or mobile number. Please register.'
            ], 404);
        }
        break;

    case 'send_otp':
        $phone = trim($data['phone'] ?? ($data['mobile'] ?? ''));
        if (empty($phone)) {
            sendResponse(['status' => false, 'message' => 'Mobile number is required to generate OTP.'], 400);
        }

        // Generate dynamic 4-digit OTP
        $otp = str_pad((string)rand(1000, 9999), 4, '0', STR_PAD_LEFT);
        $expiry = date('Y-m-d H:i:s', strtotime('+10 minutes'));

        // Check if customer exists and update OTP; if not, store in session or return
        $stmt = $conn->prepare("UPDATE customers SET otp = ?, otp_expiry = ? WHERE mobile = ?");
        if ($stmt) {
            $stmt->bind_param("sss", $otp, $expiry, $phone);
            $stmt->execute();
        }

        sendResponse([
            'status' => true,
            'message' => "OTP generated successfully: {$otp}",
            'otp' => $otp,
            'expires_in' => '10 minutes'
        ]);
        break;

    case 'register':
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $phone = trim($data['phone'] ?? ($data['mobile'] ?? ''));
        $password = trim($data['password'] ?? '');
        $address = trim($data['address'] ?? '');
        $otp = trim($data['otp'] ?? '');

        if (empty($name) || empty($phone)) {
            sendResponse(['status' => false, 'message' => 'Name and 10-digit mobile number are required.'], 400);
        }

        if (empty($password)) {
            sendResponse(['status' => false, 'message' => 'Please set a secure password for your account.'], 400);
        }

        // Check existing by mobile
        $check = $conn->prepare("SELECT id FROM customers WHERE mobile = ? LIMIT 1");
        $check->bind_param("s", $phone);
        $check->execute();
        $checkRes = $check->get_result();

        if ($checkRes && $checkRes->num_rows > 0) {
            sendResponse([
                'status' => false,
                'message' => 'An account already exists with this mobile number. Please sign in.'
            ], 409);
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO customers (name, mobile, email, password, address, total_orders, total_spend) VALUES (?, ?, ?, ?, ?, 0, 0.00)");
        $stmt->bind_param("sssss", $name, $phone, $email, $hashedPassword, $address);
        
        if ($stmt->execute()) {
            $newId = $conn->insert_id;

            // If default address provided, also save to customer_addresses table
            if (!empty($address)) {
                $addrStmt = $conn->prepare("INSERT INTO customer_addresses (customer_id, title, recipient_name, phone, address_line, city, pincode, is_default, type) VALUES (?, 'Home', ?, ?, ?, 'Bemetara', '491335', 1, 'Home')");
                if ($addrStmt) {
                    $addrStmt->bind_param("isss", $newId, $name, $phone, $address);
                    $addrStmt->execute();
                }
            }

            sendResponse([
                'status' => true,
                'message' => 'Account created successfully! Welcome to JSR Food Market.',
                'data' => [
                    'id' => (int)$newId,
                    'name' => $name,
                    'email' => $email,
                    'phone' => $phone,
                    'address' => $address,
                    'avatar' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                    'total_orders' => 0,
                    'total_spend' => 0.00,
                    'joinDate' => date('Y-m-d')
                ]
            ], 201);
        } else {
            sendResponse(['status' => false, 'message' => 'Registration failed: ' . $conn->error], 500);
        }
        break;

    case 'update_profile':
        $userId = (int)($data['id'] ?? 0);
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $address = trim($data['address'] ?? '');

        if ($userId <= 0) {
            sendResponse(['status' => false, 'message' => 'Invalid user ID.'], 400);
        }

        $stmt = $conn->prepare("UPDATE customers SET name = ?, email = ?, mobile = ?, address = ? WHERE id = ?");
        $stmt->bind_param("ssssi", $name, $email, $phone, $address, $userId);
        $stmt->execute();

        sendResponse([
            'status' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'id' => $userId,
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'address' => $address
            ]
        ]);
        break;

    case 'get_addresses':
        $customerId = (int)($_GET['customer_id'] ?? ($data['customer_id'] ?? 0));
        if ($customerId <= 0) {
            sendResponse(['status' => false, 'message' => 'Customer ID required'], 400);
        }

        $stmt = $conn->prepare("SELECT * FROM customer_addresses WHERE customer_id = ? ORDER BY is_default DESC, id DESC");
        $stmt->bind_param("i", $customerId);
        $stmt->execute();
        $res = $stmt->get_result();
        
        $addresses = [];
        while ($row = $res->fetch_assoc()) {
            $addresses[] = [
                'id' => (int)$row['id'],
                'customer_id' => (int)$row['customer_id'],
                'title' => $row['title'],
                'recipient_name' => $row['recipient_name'],
                'phone' => $row['phone'],
                'address_line' => $row['address_line'],
                'landmark' => $row['landmark'] ?? '',
                'city' => $row['city'],
                'pincode' => $row['pincode'],
                'is_default' => (bool)$row['is_default'],
                'type' => $row['type'] ?? 'Home',
                'created_at' => $row['created_at']
            ];
        }

        sendResponse([
            'status' => true,
            'data' => $addresses
        ]);
        break;

    case 'add_address':
        $customerId = (int)($data['customer_id'] ?? 0);
        $title = trim($data['title'] ?? 'Home');
        $recipientName = trim($data['recipient_name'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $addressLine = trim($data['address_line'] ?? '');
        $landmark = trim($data['landmark'] ?? '');
        $city = trim($data['city'] ?? 'Bemetara');
        $pincode = trim($data['pincode'] ?? '491335');
        $isDefault = !empty($data['is_default']) ? 1 : 0;
        $type = trim($data['type'] ?? 'Home');

        if ($customerId <= 0 || empty($recipientName) || empty($phone) || empty($addressLine)) {
            sendResponse(['status' => false, 'message' => 'Recipient name, phone and address are required.'], 400);
        }

        // If default address, clear other defaults
        if ($isDefault === 1) {
            $clear = $conn->prepare("UPDATE customer_addresses SET is_default = 0 WHERE customer_id = ?");
            $clear->bind_param("i", $customerId);
            $clear->execute();
        }

        $stmt = $conn->prepare("INSERT INTO customer_addresses (customer_id, title, recipient_name, phone, address_line, landmark, city, pincode, is_default, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isssssssis", $customerId, $title, $recipientName, $phone, $addressLine, $landmark, $city, $pincode, $isDefault, $type);
        
        if ($stmt->execute()) {
            $newAddrId = $conn->insert_id;
            sendResponse([
                'status' => true,
                'message' => 'Address added successfully',
                'data' => [
                    'id' => $newAddrId,
                    'customer_id' => $customerId,
                    'title' => $title,
                    'recipient_name' => $recipientName,
                    'phone' => $phone,
                    'address_line' => $addressLine,
                    'landmark' => $landmark,
                    'city' => $city,
                    'pincode' => $pincode,
                    'is_default' => (bool)$isDefault,
                    'type' => $type
                ]
            ]);
        } else {
            sendResponse(['status' => false, 'message' => 'Failed to add address: ' . $conn->error], 500);
        }
        break;

    case 'update_address':
        $addressId = (int)($data['id'] ?? 0);
        $customerId = (int)($data['customer_id'] ?? 0);
        $title = trim($data['title'] ?? 'Home');
        $recipientName = trim($data['recipient_name'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $addressLine = trim($data['address_line'] ?? '');
        $landmark = trim($data['landmark'] ?? '');
        $city = trim($data['city'] ?? 'Bemetara');
        $pincode = trim($data['pincode'] ?? '491335');
        $type = trim($data['type'] ?? 'Home');

        if ($addressId <= 0 || empty($recipientName) || empty($phone) || empty($addressLine)) {
            sendResponse(['status' => false, 'message' => 'Address ID, recipient name, phone, and address are required.'], 400);
        }

        $stmt = $conn->prepare("UPDATE customer_addresses SET title = ?, recipient_name = ?, phone = ?, address_line = ?, landmark = ?, city = ?, pincode = ?, type = ? WHERE id = ? " . ($customerId > 0 ? "AND customer_id = ?" : ""));
        if ($customerId > 0) {
            $stmt->bind_param("ssssssssii", $title, $recipientName, $phone, $addressLine, $landmark, $city, $pincode, $type, $addressId, $customerId);
        } else {
            $stmt->bind_param("ssssssssi", $title, $recipientName, $phone, $addressLine, $landmark, $city, $pincode, $type, $addressId);
        }

        if ($stmt->execute()) {
            sendResponse([
                'status' => true,
                'message' => 'Address updated successfully',
                'data' => [
                    'id' => $addressId,
                    'customer_id' => $customerId,
                    'title' => $title,
                    'recipient_name' => $recipientName,
                    'phone' => $phone,
                    'address_line' => $addressLine,
                    'landmark' => $landmark,
                    'city' => $city,
                    'pincode' => $pincode,
                    'type' => $type
                ]
            ]);
        } else {
            sendResponse(['status' => false, 'message' => 'Failed to update address: ' . $conn->error], 500);
        }
        break;

    case 'delete_address':
        $addressId = (int)($data['id'] ?? ($_GET['id'] ?? 0));
        $customerId = (int)($data['customer_id'] ?? ($_GET['customer_id'] ?? 0));

        if ($addressId <= 0) {
            sendResponse(['status' => false, 'message' => 'Invalid address ID'], 400);
        }

        $stmt = $conn->prepare("DELETE FROM customer_addresses WHERE id = ? " . ($customerId > 0 ? "AND customer_id = ?" : ""));
        if ($customerId > 0) {
            $stmt->bind_param("ii", $addressId, $customerId);
        } else {
            $stmt->bind_param("i", $addressId);
        }
        $stmt->execute();

        sendResponse(['status' => true, 'message' => 'Address deleted successfully']);
        break;

    case 'set_default_address':
        $addressId = (int)($data['id'] ?? 0);
        $customerId = (int)($data['customer_id'] ?? 0);

        if ($addressId <= 0 || $customerId <= 0) {
            sendResponse(['status' => false, 'message' => 'Address ID and customer ID are required'], 400);
        }

        $clear = $conn->prepare("UPDATE customer_addresses SET is_default = 0 WHERE customer_id = ?");
        $clear->bind_param("i", $customerId);
        $clear->execute();

        $set = $conn->prepare("UPDATE customer_addresses SET is_default = 1 WHERE id = ? AND customer_id = ?");
        $set->bind_param("ii", $addressId, $customerId);
        $set->execute();

        sendResponse(['status' => true, 'message' => 'Default address updated']);
        break;

    case 'admin_login':
        $identifier = trim($data['identifier'] ?? ($data['email'] ?? ''));
        $password = trim($data['password'] ?? '');

        if (empty($identifier) || empty($password)) {
            sendResponse(['status' => false, 'message' => 'Please provide email/mobile and password.'], 400);
        }

        // Strictly query admin table from MySQL
        $stmt = $conn->prepare("SELECT * FROM admin WHERE email = ? OR mobile = ? LIMIT 1");
        $stmt->bind_param("ss", $identifier, $identifier);
        $stmt->execute();
        $res = $stmt->get_result();

        if ($res && $res->num_rows > 0) {
            $admin = $res->fetch_assoc();
            
            // Verify password using password_verify or exact match
            $isPasswordValid = ($password === $admin['password']) || password_verify($password, $admin['password']);
            
            if ($isPasswordValid) {
                sendResponse([
                    'status' => true,
                    'message' => 'Admin authentication successful',
                    'data' => [
                        'admin_id' => (int)$admin['admin_id'],
                        'name' => $admin['name'] ?? 'JSR Admin',
                        'email' => $admin['email'] ?? 'jsrveges@gmail.com',
                        'mobile' => $admin['mobile'] ?? '',
                        'company_name' => $admin['company_name'] ?? 'JSR Fruit & Vegetable Company',
                        'address' => $admin['address'] ?? 'Bemetara, Chhattisgarh',
                        'role' => 'Super Admin'
                    ]
                ]);
            } else {
                sendResponse(['status' => false, 'message' => 'Incorrect admin password. Please try again.'], 401);
            }
        } else {
            sendResponse(['status' => false, 'message' => 'No admin account found with these credentials.'], 404);
        }
        break;

    case 'admin_register':
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $mobile = trim($data['mobile'] ?? '');
        $password = trim($data['password'] ?? '');
        $companyName = trim($data['company_name'] ?? 'JSR Fruit & Vegetable Company');
        $address = trim($data['address'] ?? 'Bemetara, Chhattisgarh');

        if (empty($name) || empty($email) || empty($password)) {
            sendResponse(['status' => false, 'message' => 'Name, email and password are required.'], 400);
        }

        // Check if admin already exists
        $check = $conn->prepare("SELECT admin_id FROM admin WHERE email = ? OR mobile = ? LIMIT 1");
        $check->bind_param("ss", $email, $mobile);
        $check->execute();
        $checkRes = $check->get_result();

        if ($checkRes && $checkRes->num_rows > 0) {
            sendResponse(['status' => false, 'message' => 'An admin with this email or mobile already exists.'], 409);
        }

        $stmt = $conn->prepare("INSERT INTO admin (name, email, mobile, password, company_name, address) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $name, $email, $mobile, $password, $companyName, $address);
        
        if ($stmt->execute()) {
            $newAdminId = $conn->insert_id;
            sendResponse([
                'status' => true,
                'message' => 'New Admin registered successfully',
                'data' => [
                    'admin_id' => (int)$newAdminId,
                    'name' => $name,
                    'email' => $email,
                    'mobile' => $mobile,
                    'company_name' => $companyName,
                    'address' => $address,
                    'role' => 'Admin'
                ]
            ]);
        } else {
            sendResponse(['status' => false, 'message' => 'Admin registration failed: ' . $conn->error], 500);
        }
        break;

    default:
        sendResponse([
            'status' => false,
            'message' => 'Invalid auth action'
        ], 400);
        break;
}
?>
