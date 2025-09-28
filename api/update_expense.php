<?php
require 'db.php';
$input = json_decode(file_get_contents('php://input'), true);

$id = isset($input['id']) ? (int)$input['id'] : 0;
$description = trim($input['description'] ?? '');
$amount = $input['amount'] ?? null;
$category = trim($input['category'] ?? '');
$date = $input['date'] ?? '';

if ($id <= 0 || $description === '' || $category === '' || !is_numeric($amount) || $amount <= 0 || $date === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Validation failed']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE expenses SET description = ?, amount = ?, category = ?, date = ? WHERE id = ?");
    $stmt->execute([$description, $amount, $category, $date, $id]);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Update failed']);
}