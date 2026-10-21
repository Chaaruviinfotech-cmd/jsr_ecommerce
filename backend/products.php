<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
// Allow method override via query or POST for PUT/DELETE
if (isset($_GET['_method'])) {
    $method = strtoupper($_GET['_method']);
} elseif (isset($_POST['_method'])) {
    $method = strtoupper($_POST['_method']);
}

// -------------------------------------------------------------
// GET: Fetch products list or single product
// -------------------------------------------------------------
if ($method === 'GET') {
    // Single product by ID or slug
    if (isset($_GET['id']) && !empty($_GET['id'])) {
        $id = intval($_GET['id']);
        $stmt = $conn->prepare("SELECT p.*, c.name as category_name, c.slug as category_slug 
                                FROM products p 
                                LEFT JOIN categories c ON p.category_id = c.id 
                                WHERE p.id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($product = $result->fetch_assoc()) {
            $product['weight_options'] = json_decode($product['weight_options'] ?? '[]', true);
            $product['gallery'] = json_decode($product['gallery'] ?? '[]', true);
            sendResponse(['status' => true, 'data' => $product]);
        } else {
            sendResponse(['status' => false, 'message' => 'Product not found'], 404);
        }
    }

    // Products list with optional filters
    $whereClauses = ["p.status = 1"];
    $params = [];
    $types = "";

    if (isset($_GET['category']) && !empty($_GET['category']) && $_GET['category'] !== 'all') {
        $category = $_GET['category'];
        if (is_numeric($category)) {
            $whereClauses[] = "p.category_id = ?";
            $params[] = intval($category);
            $types .= "i";
        } else {
            $whereClauses[] = "c.slug = ?";
            $params[] = $category;
            $types .= "s";
        }
    }

    if (isset($_GET['search']) && !empty(trim($_GET['search']))) {
        $search = "%" . trim($_GET['search']) . "%";
        $whereClauses[] = "(p.name LIKE ? OR p.description LIKE ?)";
        $params[] = $search;
        $params[] = $search;
        $types .= "ss";
    }

    if (isset($_GET['best_seller']) && $_GET['best_seller'] == '1') {
        $whereClauses[] = "p.is_best_seller = 1";
    }

    $whereSQL = implode(" AND ", $whereClauses);

    $orderBy = "p.id ASC";
    if (isset($_GET['sort'])) {
        switch ($_GET['sort']) {
            case 'price_low':
                $orderBy = "p.price ASC";
                break;
            case 'price_high':
                $orderBy = "p.price DESC";
                break;
            case 'name_asc':
                $orderBy = "p.name ASC";
                break;
            case 'rating':
                $orderBy = "p.rating DESC";
                break;
            case 'latest':
                $orderBy = "p.id DESC";
                break;
        }
    }

    $sql = "SELECT p.*, c.name as category_name, c.slug as category_slug 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE $whereSQL 
            ORDER BY $orderBy";

    $stmt = $conn->prepare($sql);
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $row['weight_options'] = json_decode($row['weight_options'] ?? '[]', true);
        $row['gallery'] = json_decode($row['gallery'] ?? '[]', true);
        $products[] = $row;
    }

    sendResponse([
        'status' => true,
        'count' => count($products),
        'data' => $products
    ]);
}

// -------------------------------------------------------------
// POST: Add new product
// -------------------------------------------------------------
if ($method === 'POST') {
    $data = getRequestBody();

    if (empty($data['name']) || empty($data['price'])) {
        sendResponse(['status' => false, 'message' => 'Product name and price are required'], 400);
    }

    $name = trim($data['name']);
    $categoryId = intval($data['category_id'] ?? 1);
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
    $description = $data['description'] ?? '';
    $price = floatval($data['price']);
    $originalPrice = isset($data['original_price']) ? floatval($data['original_price']) : ($price * 1.15);
    $unit = $data['unit'] ?? '1 kg';
    $weightOptions = isset($data['weight_options']) ? (is_array($data['weight_options']) ? json_encode($data['weight_options']) : $data['weight_options']) : json_encode(["500 gm", "1 kg"]);
    $image = $data['image'] ?? 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
    $gallery = isset($data['gallery']) ? (is_array($data['gallery']) ? json_encode($data['gallery']) : $data['gallery']) : json_encode([$image]);
    $stock = intval($data['stock'] ?? 100);
    $isBestSeller = intval($data['is_best_seller'] ?? 0);

    $stmt = $conn->prepare("INSERT INTO products (category_id, name, slug, description, price, original_price, unit, weight_options, image, gallery, stock, is_best_seller) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isssddssssii", $categoryId, $name, $slug, $description, $price, $originalPrice, $unit, $weightOptions, $image, $gallery, $stock, $isBestSeller);

    if ($stmt->execute()) {
        sendResponse([
            'status' => true,
            'message' => 'Product added successfully',
            'product_id' => $stmt->insert_id
        ], 201);
    } else {
        sendResponse(['status' => false, 'message' => 'Failed to add product: ' . $stmt->error], 500);
    }
}

// -------------------------------------------------------------
// PUT: Update product
// -------------------------------------------------------------
if ($method === 'PUT') {
    $data = getRequestBody();
    $id = intval($data['id'] ?? ($_GET['id'] ?? 0));

    if (!$id) {
        sendResponse(['status' => false, 'message' => 'Product ID is required'], 400);
    }

    $name = trim($data['name']);
    $categoryId = intval($data['category_id'] ?? 1);
    $description = $data['description'] ?? '';
    $price = floatval($data['price']);
    $originalPrice = floatval($data['original_price'] ?? $price);
    $unit = $data['unit'] ?? '1 kg';
    $stock = intval($data['stock'] ?? 100);
    $isBestSeller = intval($data['is_best_seller'] ?? 0);

    $stmt = $conn->prepare("UPDATE products SET category_id = ?, name = ?, description = ?, price = ?, original_price = ?, unit = ?, stock = ?, is_best_seller = ? WHERE id = ?");
    $stmt->bind_param("issddsiii", $categoryId, $name, $description, $price, $originalPrice, $unit, $stock, $isBestSeller, $id);

    if ($stmt->execute()) {
        sendResponse(['status' => true, 'message' => 'Product updated successfully']);
    } else {
        sendResponse(['status' => false, 'message' => 'Update failed: ' . $stmt->error], 500);
    }
}

// -------------------------------------------------------------
// DELETE: Remove product
// -------------------------------------------------------------
if ($method === 'DELETE' || isset($_GET['delete'])) {
    $id = intval($_GET['delete'] ?? ($_GET['id'] ?? 0));
    if (!$id) {
        $body = getRequestBody();
        $id = intval($body['id'] ?? 0);
    }

    if (!$id) {
        sendResponse(['status' => false, 'message' => 'Product ID is required'], 400);
    }

    // Soft delete or hard delete
    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        sendResponse(['status' => true, 'message' => 'Product deleted successfully']);
    } else {
        sendResponse(['status' => false, 'message' => 'Delete failed: ' . $stmt->error], 500);
    }
}

sendResponse(['status' => false, 'message' => 'Unsupported method'], 405);
?>
