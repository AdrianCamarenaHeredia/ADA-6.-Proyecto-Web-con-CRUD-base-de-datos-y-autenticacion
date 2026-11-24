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

//Leer historial
if ($action == 'list') {
    $stmt = $pdo->query("
        SELECT m.*, p.nombre as producto, u.email 
        FROM movimientos m 
        JOIN productos p ON m.producto_id = p.id 
        JOIN usuarios u ON m.usuario_id = u.id 
        ORDER BY m.fecha DESC LIMIT 10
    ");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

//Registrar movimiento
if ($action == 'create' && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $producto_id = $data['producto_id'];
    $tipo = $data['tipo'];
    $cantidad = $data['cantidad'];
    $usuario_id = $_SESSION['user_id'];

    $stmt = $pdo->prepare("INSERT INTO movimientos (producto_id, tipo, cantidad, usuario_id) VALUES (?, ?, ?, ?)");
    $stmt->execute([$producto_id, $tipo, $cantidad, $usuario_id]);

    if ($tipo == 'entrada') {
        $update = $pdo->prepare("UPDATE productos SET stock = stock + ? WHERE id = ?");
    } else {
        $update = $pdo->prepare("UPDATE productos SET stock = stock - ? WHERE id = ?");
    }
    $update->execute([$cantidad, $producto_id]);

    echo json_encode(['status' => 'success']);
    exit;
}
?>