<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'GET') {
    $statusFilter = isset($_GET['status']) ? (int)$_GET['status'] : null;
    $positionFilter = trim($_GET['position'] ?? '');

    $sql = "SELECT * FROM advertisements WHERE 1=1";
    $params = [];
    $types = "";

    if ($statusFilter !== null) {
        $sql .= " AND status = ?";
        $params[] = $statusFilter;
        $types .= "i";
    }

    if (!empty($positionFilter)) {
        $sql .= " AND position = ?";
        $params[] = $positionFilter;
        $types .= "s";
    }

    $sql .= " ORDER BY display_order ASC, id DESC";

    if (!empty($params)) {
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $res = $stmt->get_result();
    } else {
        $res = $conn->query($sql);
    }

    $banners = [];
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $banners[] = [
                'id' => (int)$row['id'],
                'title' => $row['title'],
                'subtitle' => $row['subtitle'] ?? '',
                'badge' => $row['badge'] ?? '',
                'image' => $row['image'],
                'target_link' => $row['target_link'] ?? '/products',
                'position' => $row['position'] ?? 'hero',
                'status' => (int)$row['status'],
                'display_order' => (int)$row['display_order'],
                'created_at' => $row['created_at']
            ];
        }
    }

    sendResponse([
        'status' => true,
        'count' => count($banners),
        'data' => $banners
    ]);
} else if ($method === 'POST') {
    $data = getJsonInput();
    $subAction = $action ?: ($data['action'] ?? 'create');

    switch ($subAction) {
        case 'create':
            $title = trim($data['title'] ?? '');
            $subtitle = trim($data['subtitle'] ?? '');
            $badge = trim($data['badge'] ?? 'Special Offer');
            $image = trim($data['image'] ?? '');
            $targetLink = trim($data['target_link'] ?? '/products');
            $position = trim($data['position'] ?? 'hero');
            $status = isset($data['status']) ? (int)$data['status'] : 1;
            $order = isset($data['display_order']) ? (int)$data['display_order'] : 1;

            if (empty($title) || empty($image)) {
                sendResponse(['status' => false, 'message' => 'Banner title and image URL are required.'], 400);
            }

            $stmt = $conn->prepare("INSERT INTO advertisements (title, subtitle, badge, image, target_link, position, status, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssssii", $title, $subtitle, $badge, $image, $targetLink, $position, $status, $order);

            if ($stmt->execute()) {
                $newId = $conn->insert_id;
                sendResponse([
                    'status' => true,
                    'message' => 'Advertisement banner added successfully',
                    'data' => [
                        'id' => (int)$newId,
                        'title' => $title,
                        'subtitle' => $subtitle,
                        'badge' => $badge,
                        'image' => $image,
                        'target_link' => $targetLink,
                        'position' => $position,
                        'status' => $status,
                        'display_order' => $order
                    ]
                ], 201);
            } else {
                sendResponse(['status' => false, 'message' => 'Failed to add advertisement: ' . $conn->error], 500);
            }
            break;

        case 'update':
            $id = (int)($data['id'] ?? ($_GET['id'] ?? 0));
            if ($id <= 0) {
                sendResponse(['status' => false, 'message' => 'Advertisement ID required.'], 400);
            }

            $title = trim($data['title'] ?? '');
            $subtitle = trim($data['subtitle'] ?? '');
            $badge = trim($data['badge'] ?? '');
            $image = trim($data['image'] ?? '');
            $targetLink = trim($data['target_link'] ?? '/products');
            $position = trim($data['position'] ?? 'hero');
            $status = isset($data['status']) ? (int)$data['status'] : 1;
            $order = isset($data['display_order']) ? (int)$data['display_order'] : 1;

            $stmt = $conn->prepare("UPDATE advertisements SET title = ?, subtitle = ?, badge = ?, image = ?, target_link = ?, position = ?, status = ?, display_order = ? WHERE id = ?");
            $stmt->bind_param("ssssssiii", $title, $subtitle, $badge, $image, $targetLink, $position, $status, $order, $id);

            if ($stmt->execute()) {
                sendResponse(['status' => true, 'message' => 'Advertisement banner updated successfully']);
            } else {
                sendResponse(['status' => false, 'message' => 'Failed to update advertisement: ' . $conn->error], 500);
            }
            break;

        case 'toggle':
            $id = (int)($data['id'] ?? ($_GET['id'] ?? 0));
            if ($id <= 0) {
                sendResponse(['status' => false, 'message' => 'Advertisement ID required.'], 400);
            }

            $stmt = $conn->prepare("UPDATE advertisements SET status = IF(status = 1, 0, 1) WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();

            sendResponse(['status' => true, 'message' => 'Advertisement status toggled successfully']);
            break;

        case 'delete':
            $id = (int)($data['id'] ?? ($_GET['id'] ?? 0));
            if ($id <= 0) {
                sendResponse(['status' => false, 'message' => 'Advertisement ID required.'], 400);
            }

            $stmt = $conn->prepare("DELETE FROM advertisements WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();

            sendResponse(['status' => true, 'message' => 'Advertisement deleted successfully']);
            break;

        default:
            sendResponse(['status' => false, 'message' => 'Invalid advertisement action.'], 400);
            break;
    }
} else {
    sendResponse(['status' => false, 'message' => 'Method not allowed.'], 405);
}
?>
