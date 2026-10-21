<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
if (isset($_GET['_method'])) {
    $method = strtoupper($_GET['_method']);
} elseif (isset($_POST['_method'])) {
    $method = strtoupper($_POST['_method']);
}

// -------------------------------------------------------------
// GET: Fetch orders or single order tracking details
// -------------------------------------------------------------
if ($method === 'GET') {
    // Single order by ID or order_number
    if (isset($_GET['id']) || isset($_GET['order_number'])) {
        $identifier = $_GET['id'] ?? $_GET['order_number'];
        $isNum = is_numeric($identifier);

        if ($isNum) {
            $stmt = $conn->prepare("SELECT * FROM orders WHERE id = ? OR order_number = ?");
            $orderNumStr = "#ORD" . $identifier;
            $stmt->bind_param("is", $identifier, $orderNumStr);
        } else {
            $stmt = $conn->prepare("SELECT * FROM orders WHERE order_number = ?");
            $stmt->bind_param("s", $identifier);
        }

        $stmt->execute();
        $orderRes = $stmt->get_result();

        if ($order = $orderRes->fetch_assoc()) {
            // Fetch items
            $itemStmt = $conn->prepare("SELECT * FROM order_items WHERE order_id = ?");
            $itemStmt->bind_param("i", $order['id']);
            $itemStmt->execute();
            $itemsRes = $itemStmt->get_result();

            $items = [];
            while ($item = $itemsRes->fetch_assoc()) {
                $items[] = $item;
            }
            $order['items'] = $items;

            // Tracking progress steps
            $statuses = ['Order Placed', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered'];
            $currentStatus = $order['status'];
            $statusMap = [
                'Pending' => 0,
                'Processing' => 1,
                'Confirmed' => 1,
                'Packed' => 2,
                'Out for Delivery' => 3,
                'Delivered' => 4
            ];
            $currentStepIndex = $statusMap[$currentStatus] ?? 0;

            $trackingTimeline = [
                ['title' => 'Order Placed', 'time' => date('d M Y, h:i A', strtotime($order['order_date'])), 'completed' => true],
                ['title' => 'Confirmed', 'time' => date('d M Y, h:i A', strtotime($order['order_date'] . ' +5 minutes')), 'completed' => $currentStepIndex >= 1],
                ['title' => 'Packed', 'time' => date('d M Y, h:i A', strtotime($order['order_date'] . ' +50 minutes')), 'completed' => $currentStepIndex >= 2],
                ['title' => 'Out for Delivery', 'time' => date('d M Y, h:i A', strtotime($order['order_date'] . ' +100 minutes')), 'completed' => $currentStepIndex >= 3],
                ['title' => 'Delivered', 'time' => date('d M Y, h:i A', strtotime($order['order_date'] . ' +150 minutes')), 'completed' => $currentStepIndex >= 4],
            ];
            $order['tracking_timeline'] = $trackingTimeline;

            sendResponse(['status' => true, 'data' => $order]);
        } else {
            sendResponse(['status' => false, 'message' => 'Order not found'], 404);
        }
    }

    // List all orders for Admin
    $whereSQL = "1=1";
    if (isset($_GET['status']) && !empty($_GET['status']) && $_GET['status'] !== 'all') {
        $status = $conn->real_escape_string($_GET['status']);
        $whereSQL .= " AND status = '$status'";
    }

    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
    $sql = "SELECT * FROM orders WHERE $whereSQL ORDER BY id DESC LIMIT $limit";
    $result = $conn->query($sql);

    $orders = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }
    }

    sendResponse([
        'status' => true,
        'count' => count($orders),
        'data' => $orders
    ]);
}

// -------------------------------------------------------------
// POST: Place new order OR update status
// -------------------------------------------------------------
if ($method === 'POST') {
    $data = getRequestBody();

    // Check if updating status
    if (isset($data['action']) && $data['action'] === 'update_status') {
        $orderId = intval($data['order_id'] ?? 0);
        $newStatus = trim($data['status'] ?? '');

        if (!$orderId || empty($newStatus)) {
            sendResponse(['status' => false, 'message' => 'Order ID and status are required'], 400);
        }

        $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
        $stmt->bind_param("si", $newStatus, $orderId);

        if ($stmt->execute()) {
            sendResponse(['status' => true, 'message' => 'Order status updated successfully']);
        } else {
            sendResponse(['status' => false, 'message' => 'Failed to update order status'], 500);
        }
    }

    // New order placement
    if (empty($data['customer_name']) || empty($data['customer_mobile']) || empty($data['items'])) {
        sendResponse(['status' => false, 'message' => 'Missing required customer details or items'], 400);
    }

    $orderNumber = '#ORD' . rand(1000, 9999);
    $customerName = trim($data['customer_name']);
    $customerMobile = trim($data['customer_mobile']);
    $customerEmail = trim($data['customer_email'] ?? '');
    $address = trim($data['delivery_address'] ?? 'Local Delivery');
    $city = trim($data['city'] ?? 'Bemetara');
    $pincode = trim($data['pincode'] ?? '491335');
    $subtotal = floatval($data['subtotal'] ?? 0);
    $deliveryFee = floatval($data['delivery_fee'] ?? 0);
    $discount = floatval($data['discount'] ?? 0);
    $totalAmount = floatval($data['total_amount'] ?? ($subtotal + $deliveryFee - $discount));
    $paymentMethod = trim($data['payment_method'] ?? 'COD');
    $status = 'Processing';

    $stmt = $conn->prepare("INSERT INTO orders (order_number, customer_name, customer_mobile, customer_email, delivery_address, city, pincode, subtotal, delivery_fee, discount, total_amount, payment_method, status) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssssdddsss", $orderNumber, $customerName, $customerMobile, $customerEmail, $address, $city, $pincode, $subtotal, $deliveryFee, $discount, $totalAmount, $paymentMethod, $status);

    if ($stmt->execute()) {
        $orderId = $stmt->insert_id;

        // Insert items
        if (!empty($data['items']) && is_array($data['items'])) {
            $itemStmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, product_name, product_image, weight_unit, unit_price, quantity, item_total) 
                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($data['items'] as $item) {
                $pid = intval($item['product_id'] ?? $item['id'] ?? 0);
                $pname = $item['name'] ?? 'Fresh Produce';
                $pimg = $item['image'] ?? '';
                $unit = $item['selected_weight'] ?? ($item['unit'] ?? '1 kg');
                $price = floatval($item['price'] ?? 0);
                $qty = intval($item['quantity'] ?? 1);
                $lineTotal = $price * $qty;

                $itemStmt->bind_param("iisssdid", $orderId, $pid, $pname, $pimg, $unit, $price, $qty, $lineTotal);
                $itemStmt->execute();
            }
        }

        // Upsert customer
        $custStmt = $conn->prepare("INSERT INTO customers (name, mobile, email, address, total_orders, total_spend) 
                                    VALUES (?, ?, ?, ?, 1, ?) 
                                    ON DUPLICATE KEY UPDATE 
                                    total_orders = total_orders + 1, 
                                    total_spend = total_spend + VALUES(total_spend)");
        $custStmt->bind_param("ssssd", $customerName, $customerMobile, $customerEmail, $address, $totalAmount);
        @$custStmt->execute();

        sendResponse([
            'status' => true,
            'message' => 'Order placed successfully',
            'order_id' => $orderId,
            'order_number' => $orderNumber
        ], 201);
    } else {
        sendResponse(['status' => false, 'message' => 'Failed to create order: ' . $stmt->error], 500);
    }
}

sendResponse(['status' => false, 'message' => 'Method not allowed'], 405);
?>
