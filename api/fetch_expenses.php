<?php
require 'db.php';

try {
    $stmt = $pdo->query("SELECT id, description, amount, category, date FROM expenses ORDER BY date DESC, id DESC");
    $rows = $stmt->fetchAll();
    echo json_encode(['success' => true, 'expenses' => $rows]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Fetch failed']);
}
