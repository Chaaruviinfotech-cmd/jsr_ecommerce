<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT c.*, COUNT(p.id) as product_count 
            FROM categories c 
            LEFT JOIN products p ON c.id = p.category_id AND p.status = 1 
            WHERE c.status = 1 
            GROUP BY c.id 
            ORDER BY c.id ASC";

    $result = $conn->query($sql);
    $categories = [];

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $categories[] = [
                'id' => (int)$row['id'],
                'name' => $row['name'],
                'slug' => $row['slug'],
                'description' => $row['description'],
                'image' => $row['image'],
                'status' => (int)$row['status'],
                'product_count' => (int)$row['product_count'],
                'created_at' => $row['created_at']
            ];
        }
    }

    sendResponse([
        'status' => true,
        'count' => count($categories),
        'data' => $categories
    ]);
}

if ($method === 'POST') {
    $data = getRequestBody();
    $action = $data['action'] ?? ($_GET['action'] ?? 'create');

    // DELETE ACTION
    if ($action === 'delete') {
        $id = (int)($data['id'] ?? ($_GET['id'] ?? 0));
        if ($id <= 0) {
            sendResponse(['status' => false, 'message' => 'Invalid category ID'], 400);
        }

        $stmt = $conn->prepare("UPDATE categories SET status = 0 WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            sendResponse(['status' => true, 'message' => 'Category deleted successfully']);
        } else {
            sendResponse(['status' => false, 'message' => 'Failed to delete category: ' . $conn->error], 500);
        }
    }

    // UPDATE ACTION
    if ($action === 'update') {
        $id = (int)($data['id'] ?? 0);
        if ($id <= 0 || empty($data['name'])) {
            sendResponse(['status' => false, 'message' => 'Valid category ID and name are required'], 400);
        }

        $name = trim($data['name']);
        $baseSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
        $slug = !empty($data['slug']) ? trim($data['slug']) : ($baseSlug ?: 'cat-' . $id);
        $desc = $data['description'] ?? '';
        $image = $data['image'] ?? 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';

        $stmt = $conn->prepare("UPDATE categories SET name = ?, slug = ?, description = ?, image = ? WHERE id = ?");
        $stmt->bind_param("ssssi", $name, $slug, $desc, $image, $id);

        if ($stmt->execute()) {
            sendResponse([
                'status' => true,
                'message' => 'Category updated successfully',
                'data' => [
                    'id' => $id,
                    'name' => $name,
                    'slug' => $slug,
                    'description' => $desc,
                    'image' => $image,
                    'status' => 1
                ]
            ]);
        } else {
            sendResponse(['status' => false, 'message' => 'Failed to update category: ' . $stmt->error], 500);
        }
    }

    // CREATE ACTION (Default)
    if (empty($data['name'])) {
        sendResponse(['status' => false, 'message' => 'Category name is required'], 400);
    }

    $name = trim($data['name']);
    $baseSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
    if (empty($baseSlug)) {
        $baseSlug = 'cat-' . time();
    }

    // Check slug uniqueness
    $slug = $baseSlug;
    $check = $conn->prepare("SELECT id FROM categories WHERE slug = ?");
    $check->bind_param("s", $slug);
    $check->execute();
    if ($check->get_result()->num_rows > 0) {
        $slug = $baseSlug . '-' . time();
    }

    $desc = $data['description'] ?? '';
    $image = $data['image'] ?? 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';

    $stmt = $conn->prepare("INSERT INTO categories (name, slug, description, image, status) VALUES (?, ?, ?, ?, 1)");
    $stmt->bind_param("ssss", $name, $slug, $desc, $image);

    if ($stmt->execute()) {
        $newId = $stmt->insert_id;
        sendResponse([
            'status' => true,
            'message' => 'Category added successfully',
            'data' => [
                'id' => $newId,
                'name' => $name,
                'slug' => $slug,
                'description' => $desc,
                'image' => $image,
                'status' => 1,
                'product_count' => 0
            ]
        ], 201);
    } else {
        sendResponse(['status' => false, 'message' => 'Failed to create category: ' . $stmt->error], 500);
    }
}

sendResponse(['status' => false, 'message' => 'Method not allowed'], 405);
?>
