<?php
require_once 'config.php';

$pincode = trim($_GET['pincode'] ?? ($_POST['pincode'] ?? ''));

if (empty($pincode)) {
    sendResponse(['status' => false, 'message' => 'Pincode is required'], 400);
}

$stmt = $conn->prepare("SELECT * FROM delivery_pincodes WHERE pincode = ? AND status = 1");
$stmt->bind_param("s", $pincode);
$stmt->execute();
$res = $stmt->get_result();

if ($row = $res->fetch_assoc()) {
    sendResponse([
        'status' => true,
        'deliverable' => true,
        'message' => 'Great news! We deliver to ' . $row['area_name'] . ' (' . $row['city'] . ')',
        'data' => [
            'pincode' => $row['pincode'],
            'area' => $row['area_name'],
            'city' => $row['city'],
            'delivery_charge' => floatval($row['delivery_charge']),
            'estimated_time' => $row['estimated_delivery']
        ]
    ]);
} else {
    // If pincode is within Chhattisgarh/Bemetara/Raipur region
    if (in_array(substr($pincode, 0, 3), ['491', '492', '490'])) {
        sendResponse([
            'status' => true,
            'deliverable' => true,
            'message' => 'Delivery available in your area! Standard delivery within 24 hours.',
            'data' => [
                'pincode' => $pincode,
                'area' => 'Nearby Raipur/Bemetara Zone',
                'city' => 'Chhattisgarh',
                'delivery_charge' => 0.00,
                'estimated_time' => 'Same Day / Next Morning'
            ]
        ]);
    } else {
        sendResponse([
            'status' => false,
            'deliverable' => false,
            'message' => 'Sorry, we currently only deliver in Bemetara, Raipur & Nearby Areas (Pincodes starting with 491, 492, 490).'
        ]);
    }
}
?>
