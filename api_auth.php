<?php
session_start();
require 'db.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

//Verificar si hay sesión activa
if ($action == 'check') {
    echo json_encode(['logged_in' => isset($_SESSION['user_id'])]);
    exit;
}

//Iniciar Sesión
if ($action == 'login' && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && $password === $user['password']) { // Nota: Usar password_verify en producción
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Credenciales incorrectas']);
    }
    exit;
}

//Cerrar Sesión
if ($action == 'logout') {
    session_destroy();
    echo json_encode(['status' => 'success']);
    exit;
}
?>