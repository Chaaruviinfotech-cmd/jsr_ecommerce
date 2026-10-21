<?php
require_once 'config.php';

$res = $conn->query("SELECT * FROM customers ORDER BY total_orders DESC, id DESC");
$customers = [];
if ($res) {
    while ($row = $res->fetch_assoc()) {
        $customers[] = $row;
    }
}

sendResponse([
    'status' => true,
    'count' => count($customers),
    'data' => $customers
]);
?>
