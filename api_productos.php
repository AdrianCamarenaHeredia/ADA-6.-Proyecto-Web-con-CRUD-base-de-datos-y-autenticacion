<?php
session_start();
require 'db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

$action = $_GET['action'] ?? '';

//Leer productos
if ($action == 'list') {
    $stmt = $pdo->query("SELECT * FROM productos ORDER BY id DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

//Productos con stock bajo
if ($action == 'low_stock') {
    $stmt = $pdo->query("SELECT * FROM productos WHERE stock <= stock_minimo ORDER BY stock ASC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

//CRUD
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if ($action == 'create') {
        $stmt = $pdo->prepare("INSERT INTO productos (nombre, categoria, precio_compra, precio_venta, stock) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['nombre'], $data['categoria'], $data['precio_compra'], $data['precio_venta'], $data['stock']]);
        echo json_encode(['status' => 'success']);
    } 
    elseif ($action == 'update') {
        $stmt = $pdo->prepare("UPDATE productos SET nombre = ?, precio_venta = ?, stock = ? WHERE id = ?");
        $stmt->execute([$data['nombre'], $data['precio_venta'], $data['stock'], $data['id']]);
        echo json_encode(['status' => 'success']);
    }
    elseif ($action == 'delete') {
        $stmt = $pdo->prepare("DELETE FROM productos WHERE id = ?");
        $stmt->execute([$data['id']]);
        echo json_encode(['status' => 'success']);
    }
    exit;
}
?>