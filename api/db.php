<?php
// api/db.php
// DEVELOPMENT: show errors (remove or disable in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
// header('Access-Control-Allow-Origin: *'); // dev only - remove or restrict in production

$host = '127.0.0.1';
$db   = 'ExpenseTrackerDB';
$user = 'root';
$pass = ''; // XAMPP default: empty. Change if you set a password.
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DB connection failed']);
    exit;
}