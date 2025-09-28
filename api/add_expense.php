<?php
require 'db.php';
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

$description = trim($input['description'] ?? '');
$amount = $input['amount'] ?? null;
$category = trim($input['category'] ?? '');
$date = $input['date'] ?? '';

if ($description === '' || $category === '' || !is_numeric($amount) || $amount <= 0 || $date === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Validation failed']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO expenses (description, amount, category, date) VALUES (?, ?, ?, ?)");
    $stmt->execute([$description, $amount, $category, $date]);
    $id = $pdo->lastInsertId();

    echo json_encode(['success' => true, 'id' => (int)$id]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Insert failed']);
}
